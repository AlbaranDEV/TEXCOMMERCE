import pool from "../../../backend/app/config/db.js";
import * as usuarios from "../../../backend/app/services/usuarios.service.js";
import * as pedidos from "../../../backend/app/services/pedidos.service.js";
import * as admin from "../../../backend/app/services/admin.service.js";
import { POLITICA } from "../../../backend/app/config/politica.js";
import {
    dtoRegistro, dtoPerfil, dtoAdminUsuario, dtoItemsPedido, idValido
} from "../../../backend/app/utils/dto.js";

const esStaff = (usuario) => usuario?.rol === "admin" || usuario?.rol === "moderador";

// Solo se permiten redirecciones internas ("/ruta"), nunca a otro dominio
const destinoSeguro = (valor) =>
    typeof valor === "string" && valor.startsWith("/") && !valor.startsWith("//") && !valor.startsWith("/\\")
        ? valor
        : null;

// Los errores de validación o negocio se muestran; los inesperados solo se registran
const mensajeError = (error, contexto) => {
    if (error.status && error.status < 500) {
        return error.message;
    }
    console.error(`${contexto}:`, error);
    return "Ocurrió un error inesperado. Inténtalo de nuevo.";
};

// "Chrome en Windows", a partir del user-agent (solo para mostrar en el panel)
const describirNavegador = (agente = "") => {
    const navegador = [["Edg/", "Edge"], ["OPR/", "Opera"], ["Firefox/", "Firefox"], ["Chrome/", "Chrome"], ["Safari/", "Safari"]]
        .find(([marca]) => agente.includes(marca))?.[1] || "Otro navegador";
    const sistema = [["Windows", "Windows"], ["Android", "Android"], ["iPhone", "iPhone"], ["iPad", "iPad"], ["Mac OS", "macOS"], ["Linux", "Linux"]]
        .find(([marca]) => agente.includes(marca))?.[1] || "otro sistema";
    return `${navegador} en ${sistema}`;
};

// Crea una sesión nueva (evita fijación de sesión) con los datos mínimos del usuario
const iniciarSesion = (req, usuario) => new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
        if (err) return reject(err);
        req.session.usuario = {
            id_usuario: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        };
        // Metadatos para la lista de sesiones activas del panel de administración
        req.session.inicio = new Date().toISOString();
        req.session.ip = String(req.ip || "").slice(0, 45);
        req.session.navegador = describirNavegador(req.get("user-agent"));
        req.session.save((errGuardar) => (errGuardar ? reject(errGuardar) : resolve()));
    });
});

// ============================================
// VISTA 1: LOGIN
// ============================================

// GET /login - Muestra el formulario de login
export const getLogin = (req, res) => {
    const redirectUrl = destinoSeguro(req.query.redirect);
    if (req.session.usuario) {
        return res.redirect(redirectUrl || "/mi-panel");
    }
    res.render("login", { error: null, redirect: redirectUrl });
};

// POST /login - Procesa el formulario de login (clientes y personal)
export const postLogin = async (req, res) => {
    const { correo, contrasena } = req.body;
    const redirectUrl = destinoSeguro(req.body.redirect) || destinoSeguro(req.query.redirect);

    try {
        if (!correo || !contrasena) {
            return res.render("login", { error: "Correo y contraseña son obligatorios", redirect: redirectUrl });
        }

        const usuario = await usuarios.autenticar(correo, contrasena);
        if (!usuario) {
            return res.status(401).render("login", { error: "Credenciales inválidas", redirect: redirectUrl });
        }

        await iniciarSesion(req, usuario);
        res.redirect(redirectUrl || (esStaff(usuario) ? "/menu" : "/mi-panel"));
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).render("login", { error: "Error de conexión con el servidor", redirect: redirectUrl });
    }
};

// ============================================
// VISTA 2: MENÚ PRINCIPAL (moderador y admin)
// ============================================

const PERIODOS = ["todos", "30d", "anio"];

export const getMenu = async (req, res, next) => {
    try {
        const periodo = PERIODOS.includes(req.query.periodo) ? req.query.periodo : "todos";
        const [ventas, pedidosRecientes, inventarioTelas, cuentas, sesiones, datosCumplimiento] = await Promise.all([
            admin.resumenVentas(),
            admin.historialPedidos(periodo),
            admin.inventario(),
            admin.resumenUsuarios(),
            admin.sesionesActivas(req.sessionID),
            admin.cumplimiento()
        ]);
        res.render("menu", {
            usuario: req.session.usuario,
            ventas,
            pedidos: pedidosRecientes,
            inventario: inventarioTelas,
            cuentas,
            sesiones,
            cumplimiento: datosCumplimiento,
            periodo,
            generado: new Date(),
            aviso: typeof req.query.aviso === "string" ? req.query.aviso : null,
            detalleAviso: typeof req.query.detalle === "string" ? req.query.detalle.slice(0, 120) : null
        });
    } catch (error) {
        next(error);
    }
};

// POST /admin/sesiones/cerrar - El admin cierra la sesión de otro usuario
export const postCerrarSesion = async (req, res) => {
    try {
        await admin.cerrarSesion(String(req.body.ref || ""), req.sessionID);
        res.redirect("/menu?aviso=sesion-cerrada#sesiones");
    } catch (error) {
        const detalle = encodeURIComponent(mensajeError(error, "Error al cerrar sesión"));
        res.redirect(`/menu?aviso=sesion-error&detalle=${detalle}#sesiones`);
    }
};

// GET /pedidos/exportar.csv - Descarga de todos los pedidos (moderador y admin)
export const getExportarPedidos = async (req, res, next) => {
    try {
        const csv = await admin.pedidosCsv();
        const hoy = new Date().toISOString().slice(0, 10);
        res.set("Content-Type", "text/csv; charset=utf-8");
        res.set("Content-Disposition", `attachment; filename="pedidos-texcommerce-${hoy}.csv"`);
        // BOM para que Excel reconozca los acentos
        res.send("﻿" + csv);
    } catch (error) {
        next(error);
    }
};

// GET /logout - Cierra la sesión y borra la cookie
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error("Error al cerrar sesión:", err);
        res.clearCookie(req.app.get("nombreCookieSesion"), { path: "/" });
        res.redirect("/");
    });
};

// ============================================
// VISTA 3: LISTAR USUARIOS (moderador: solo lectura; admin: gestión)
// ============================================

export const getUsuarios = async (req, res) => {
    const sesion = req.session.usuario;
    const puedeGestionar = sesion.rol === "admin";
    try {
        const lista = await usuarios.listar();
        res.render("listar", {
            usuarios: lista.map(({ id, ...resto }) => ({ id_usuario: id, ...resto })),
            usuario: sesion,
            puedeGestionar
        });
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.render("listar", { usuarios: [], usuario: sesion, puedeGestionar });
    }
};

// ============================================
// VISTA 4: CREAR USUARIO (admin)
// ============================================

export const getNuevoUsuario = (req, res) => {
    res.render("crear", { error: null });
};

export const postCrearUsuario = async (req, res) => {
    try {
        await usuarios.crear(dtoAdminUsuario(req.body, { crear: true }));
        res.redirect("/usuarios");
    } catch (error) {
        res.status(error.status || 500).render("crear", { error: mensajeError(error, "Error al crear usuario") });
    }
};

// ============================================
// VISTA 5: EDITAR USUARIO (admin)
// ============================================

export const getEditarUsuario = async (req, res) => {
    try {
        const usuario = await usuarios.obtener(idValido(req.params.id));
        if (!usuario) {
            return res.redirect("/usuarios");
        }
        const { id, ...resto } = usuario;
        res.render("editar", { usuario: { id_usuario: id, ...resto }, error: null });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.redirect("/usuarios");
    }
};

export const postEditarUsuario = async (req, res) => {
    const { id_usuario, nombre, correo, rol } = req.body;
    try {
        await usuarios.actualizar(idValido(id_usuario), dtoAdminUsuario(req.body));
        res.redirect("/usuarios");
    } catch (error) {
        res.status(error.status || 500).render("editar", {
            usuario: { id_usuario, nombre, correo, rol },
            error: mensajeError(error, "Error al actualizar usuario")
        });
    }
};

// ============================================
// VISTA 6: ELIMINAR USUARIO (admin)
// ============================================

export const postEliminarUsuario = async (req, res) => {
    try {
        await usuarios.suprimir(idValido(req.body.id_usuario));
        res.redirect("/usuarios");
    } catch (error) {
        res.status(error.status || 500).send(mensajeError(error, "Error al eliminar usuario"));
    }
};

// ============================================
// REGISTRO DE NUEVOS USUARIOS (con consentimiento, Ley 1581)
// ============================================

export const register = async (req, res) => {
    try {
        if (req.body.acepta_politica !== "si") {
            return res.status(400).render("login", {
                error: "Debes aceptar la política de tratamiento de datos para registrarte",
                redirect: null
            });
        }

        await usuarios.registrar(dtoRegistro(req.body), {
            ip: req.ip,
            userAgent: req.get("user-agent")
        });

        res.redirect("/login?registrado=true");
    } catch (error) {
        res.status(error.status || 500).render("login", {
            error: mensajeError(error, "Error al registrar usuario"),
            redirect: null
        });
    }
};

export const getPolitica = (req, res) => {
    res.render("politica", { politica: POLITICA, usuario: req.session.usuario || null });
};

// ============================================
// MI CUENTA (cualquier usuario autenticado, solo sus propios datos)
// ============================================

const renderCuenta = async (req, res, { mensaje = null, error = null, status = 200 } = {}) => {
    const id = req.session.usuario.id_usuario;
    const [perfil, consentimientos] = await Promise.all([
        usuarios.obtener(id),
        usuarios.consentimientosDe(id)
    ]);
    res.status(status).render("cuenta", { usuario: req.session.usuario, perfil, consentimientos, mensaje, error });
};

// Confirma la identidad con la contraseña actual antes de cambios sensibles
const confirmarContrasena = async (req) => {
    const usuario = await usuarios.autenticar(req.session.usuario.correo, req.body.contrasena_actual);
    return Boolean(usuario) && usuario.id === req.session.usuario.id_usuario;
};

export const getCuenta = async (req, res) => {
    try {
        await renderCuenta(req, res);
    } catch (error) {
        console.error("Error al cargar la cuenta:", error);
        res.status(500).send("Error al cargar la cuenta");
    }
};

export const postCuenta = async (req, res) => {
    try {
        if (!(await confirmarContrasena(req))) {
            return renderCuenta(req, res, { error: "La contraseña actual no es correcta", status: 401 });
        }
        const actualizado = await usuarios.actualizar(req.session.usuario.id_usuario, dtoPerfil(req.body));
        req.session.usuario.nombre = actualizado.nombre;
        req.session.usuario.correo = actualizado.correo;
        await renderCuenta(req, res, { mensaje: "Tus datos se actualizaron correctamente" });
    } catch (error) {
        await renderCuenta(req, res, { error: mensajeError(error, "Error al actualizar la cuenta"), status: error.status || 500 });
    }
};

// Derecho de supresión: elimina la cuenta propia de inmediato
export const postEliminarCuenta = async (req, res) => {
    try {
        if (!(await confirmarContrasena(req))) {
            return renderCuenta(req, res, { error: "La contraseña actual no es correcta", status: 401 });
        }
        await usuarios.suprimir(req.session.usuario.id_usuario);
        req.session.destroy(() => {
            res.clearCookie(req.app.get("nombreCookieSesion"), { path: "/" });
            res.redirect("/?cuenta_eliminada=true");
        });
    } catch (error) {
        await renderCuenta(req, res, { error: mensajeError(error, "Error al eliminar la cuenta"), status: error.status || 500 });
    }
};

// ============================================
// MI PANEL (cliente): resumen de compras, datos y accesos rápidos
// ============================================

export const getMiPanel = async (req, res) => {
    try {
        const id = req.session.usuario.id_usuario;
        const [perfil, resumen] = await Promise.all([
            usuarios.obtener(id),
            pedidos.resumenDeUsuario(id)
        ]);
        res.render("mi-panel", { usuario: req.session.usuario, perfil, resumen });
    } catch (error) {
        console.error("Error al cargar el panel del cliente:", error);
        res.status(500).send("Error al cargar tu panel");
    }
};

// ============================================
// PEDIDOS
// ============================================

export const getMisPedidos = async (req, res) => {
    try {
        const lista = await pedidos.listarDeUsuario(req.session.usuario.id_usuario);
        res.render("pedidos", { pedidos: lista, todos: false, usuario: req.session.usuario });
    } catch (error) {
        console.error("Error al listar pedidos:", error);
        res.status(500).send("Error al cargar los pedidos");
    }
};

// Moderador y admin
export const getTodosLosPedidos = async (req, res) => {
    try {
        const lista = await pedidos.listarTodos();
        res.render("pedidos", { pedidos: lista, todos: true, usuario: req.session.usuario });
    } catch (error) {
        console.error("Error al listar todos los pedidos:", error);
        res.status(500).send("Error al cargar los pedidos");
    }
};

// ============================================
// VISTAS PÚBLICAS (E-COMMERCE)
// ============================================

export const getCatalogo = async (req, res) => {
    let telas = [];
    try {
        const [rows] = await pool.query('SELECT * FROM telas ORDER BY id_tela ASC');
        telas = rows;
    } catch (error) {
        console.error("Error al obtener telas para catálogo:", error);
    }
    res.render("catalogo", {
        telas,
        usuario: req.session.usuario || null
    });
};

export const getCarrito = (req, res) => {
    res.render("carrito", {
        usuario: req.session.usuario || null
    });
};

// El JWT ya no se envía a la vista: el navegador se identifica con la cookie de sesión
export const getCheckout = (req, res) => {
    res.render("checkout", {
        usuario: req.session.usuario || null
    });
};

// POST /checkout/confirmar - Registra el carrito como pedidos del usuario en sesión.
// Los precios se calculan en el servidor a partir de la tabla telas.
export const postConfirmarPedido = async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ error: "Debe iniciar sesión para completar la orden" });
    }

    try {
        const { ids, total } = await pedidos.crearPedidos(req.session.usuario.id_usuario, dtoItemsPedido(req.body));
        res.status(201).json({
            success: true,
            message: "Pedido registrado exitosamente",
            pedidosCreados: ids.length,
            ids,
            total
        });
    } catch (error) {
        res.status(error.status || 500).json({ error: mensajeError(error, "Error al confirmar pedido") });
    }
};

export const getConocenos = (req, res) => {
    res.render("conocenos");
};

export const getContacto = (req, res) => {
    res.render("contacto");
};

export const getColecciones = (req, res) => {
    res.redirect("/catalogo");
};
