import jwt from "jsonwebtoken";
import pool from "../../../backend/app/config/db.js";
import { hashPassword, verifyPassword } from "../../../backend/app/utils/password.js";

const SECRET = process.env.JWT_SECRET || 'mi_super_hiper_recontra_clave_secreta';

// Función auxiliar para omitir el hash de contraseña al renderizar
const sinContrasena = (usuario) => {
    const { contrasena, ...resto } = usuario;
    return resto;
};

// ============================================
// VISTA 1: LOGIN
// ============================================

// GET /login - Muestra el formulario de login
export const getLogin = (req, res) => {
    const redirectUrl = req.query.redirect || null;
    if (req.session.token) {
        return res.redirect(redirectUrl || "/menu");
    }
    res.render("login", { error: null, redirect: redirectUrl });
};

// POST /login - Procesa el formulario de login
export const postLogin = async (req, res) => {
    const { correo, contrasena, redirect: redirectUrl } = req.body;
    
    try {
        if (!correo || !contrasena) {
            return res.render("login", { 
                error: "Correo y contraseña son obligatorios",
                redirect: redirectUrl || req.query.redirect || null
            });
        }

        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            return res.render("login", { 
                error: "Credenciales inválidas",
                redirect: redirectUrl || req.query.redirect || null
            });
        }

        const usuario = rows[0];
        const passwordValida = (contrasena === usuario.contrasena);
        //const passwordValida = verifyPassword(contrasena, usuario.contrasena);

        if (!passwordValida) {
            return res.render("login", { 
                error: "Credenciales inválidas",
                redirect: redirectUrl || req.query.redirect || null
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            },
            SECRET,
            { expiresIn: '2h' }
        );

        // Guardar datos en la sesión
        req.session.token = token;
        req.session.usuario = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            rol: usuario.rol
        };

        const destino = redirectUrl || req.query.redirect || "/menu";
        res.redirect(destino);

    } catch (error) {
        console.error("Error en login:", error);
        res.render("login", { 
            error: "Error de conexión con el servidor",
            redirect: redirectUrl || req.query.redirect || null
        });
    }
};

// ============================================
// VISTA 2: MENÚ PRINCIPAL
// ============================================

// GET /menu - Muestra el menú principal
export const getMenu = (req, res) => {
    res.render("menu", { usuario: req.session.usuario || null });
};

// GET /logout - Cierra la sesión
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error("Error al cerrar sesión:", err);
        res.redirect("/");
    });
};

// ============================================
// VISTA 3: LISTAR REGISTROS
// ============================================

// GET /usuarios - Muestra la lista de usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        const usuarios = rows.map(sinContrasena);
        res.render("listar", { usuarios });
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.render("listar", { usuarios: [] });
    }
};

// ============================================
// VISTA 4: CREAR REGISTRO DESDE ADMINISTRADOR
// ============================================

// GET /usuarios/nuevo - Muestra formulario de creación
export const getNuevoUsuario = (req, res) => {
    res.render("crear", { error: null });
};

// POST /usuarios/crear - Procesa la creación
export const postCrearUsuario = async (req, res) => {
    const { nombre, apellidos, correo, contrasena, rol } = req.body;
    
    try {
        if (!contrasena) {
            return res.render("crear", { error: "La contraseña es obligatoria" });
        }

        const contrasenaHasheada = hashPassword(contrasena);

        await pool.query(
            'INSERT INTO usuario (nombre, apellidos, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellidos, correo, contrasenaHasheada, rol]
        );

        res.redirect("/usuarios");

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.render("crear", { error: error.message || "Error al crear usuario" });
    }
};

// ============================================
// VISTA 5: EDITAR REGISTRO DESDE ADMINISTRADOR
// ============================================

// GET /usuarios/editar/:id - Muestra formulario de edición
export const getEditarUsuario = async (req, res) => {
    console.log("-> Entrando a getEditarUsuario con ID:", req.params.id);
    console.log("-> ¿Existe token en sesión?:", req.session?.token);

    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);

        if (rows.length === 0) {
            console.log("No se encontró el usuario con ID:", id);
            return res.redirect('/listar');
        }

        const usuario = sinContrasena(rows[0]);
        res.render("editar", { usuario, error: null });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.redirect('/listar');
    }
};

// POST /usuarios/editar - Procesa la actualización
export const postEditarUsuario = async (req, res) => {
    const { id_usuario, nombre, apellido, correo, contrasena, rol } = req.body;
    
    try {
        if (contrasena && contrasena.trim() !== '') {
            const contrasenaHasheada = hashPassword(contrasena);
            await pool.query(
                'UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, contrasena = ?, rol = ? WHERE id_usuario = ?',
                [nombre, apellido, correo, contrasenaHasheada, rol, id_usuario]
            );
        } else {
            await pool.query(
                'UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, rol = ? WHERE id_usuario = ?',
                [nombre, apellido, correo, rol, id_usuario]
            );
        }

        res.redirect("/listar");

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        const usuario = { id_usuario, nombre, apellido, correo, contrasena, rol };
        res.render("editar", { usuario, error: "Error al actualizar" });
    }
};

// ============================================
// VISTA 6: ELIMINAR REGISTRO
// ============================================

export const postEliminarUsuario = async (req, res) => {
    const { id_usuario } = req.body;
    console.log("ID recibido para eliminar:", id_usuario); // <--- Mira esto en tu terminal
    try {
        await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario]);
        res.redirect('/listar');
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).send("Error al eliminar el usuario");
    }
};

// ============================================
// REGISTRO DE NUEVOS USUARIOS (FRONTEND)
// ============================================

export const register = async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasena } = req.body;

        if (!nombre || !apellido || !correo || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const [existing] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        await pool.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, correo, contrasena, 'cliente']
        );

       // Redirigimos al login indicando que fue exitoso
        res.redirect('/login?registrado=true');
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
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

export const getCheckout = (req, res) => {
    res.render("checkout", { 
        usuario: req.session.usuario || null,
        token: req.session.token || null
    });
};

export const postConfirmarPedido = async (req, res) => {
    if (!req.session.token || !req.session.usuario) {
        return res.status(401).json({ error: "Debe iniciar sesión para completar la orden" });
    }

    const id_usuario = req.session.usuario.id_usuario;
    const { items, producto, cantidad, total } = req.body;

    try {
        // Si viene un array de partidas del carrito
        if (items && Array.isArray(items) && items.length > 0) {
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                const createdIds = [];

                for (const item of items) {
                    const descProducto = item.nombreCompleto || item.producto || `${item.nombre || 'Tela'} (${item.color || 'Estándar'})`;
                    const cantMetros = Number(item.cantidad || item.metros || 1);
                    const itemTotal = Number(item.subtotal || item.total || 0);

                    const [result] = await connection.query(
                        'INSERT INTO pedido (Id_usuario, producto, cantidad, Total, Fecha) VALUES (?, ?, ?, ?, CURDATE())',
                        [id_usuario, descProducto.substring(0, 255), cantMetros, itemTotal]
                    );
                    createdIds.push(result.insertId);
                }

                await connection.commit();
                return res.status(201).json({
                    success: true,
                    message: 'Pedido registrado exitosamente',
                    pedidosCreados: createdIds.length,
                    ids: createdIds
                });
            } catch (err) {
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
            }
        }

        // Si viene un pedido individual
        if (!producto || !cantidad) {
            return res.status(400).json({ error: 'Debe especificar producto y cantidad, o una lista de items' });
        }

        const [result] = await pool.query(
            'INSERT INTO pedido (Id_usuario, producto, cantidad, Total, Fecha) VALUES (?, ?, ?, ?, CURDATE())',
            [id_usuario, producto.substring(0, 255), Number(cantidad), Number(total || 0)]
        );

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            id_pedido: result.insertId
        });
    } catch (error) {
        console.error("Error al confirmar pedido:", error);
        res.status(500).json({ error: "Error de conexión al procesar el pedido" });
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