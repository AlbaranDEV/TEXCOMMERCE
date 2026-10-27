import { Router } from "express";
import {
    getLogin, postLogin, register, getPolitica,
    getTerminosVenta, getAvisoPrivacidad, getComposicionTelas,
    getMenu, logout, postCerrarSesion, getExportarPedidos,
    getUsuarios,
    getNuevoUsuario, postCrearUsuario,
    getEditarUsuario, postEditarUsuario,
    postEliminarUsuario,
    getMiPanel, getCuenta, postCuenta, postEliminarCuenta,
    getMisPedidos, getTodosLosPedidos,
    getCatalogo, getCarrito, getCheckout, postConfirmarPedido,
    getConocenos, getContacto,
    getColecciones
} from "../controllers/controller.views.js";
import { verificarSesion, permitirRolesVista } from "../middleware/auth.middleware.js";
import { limiteAutenticacion } from "../../../backend/app/middleware/limite.middleware.js";

const router = Router();

const soloStaff = [verificarSesion, permitirRolesVista("admin", "moderador")];
const soloAdmin = [verificarSesion, permitirRolesVista("admin")];

// ============================================
// AUTENTICACIÓN (pública, con límite de intentos)
// ============================================
// Nota: GET "/" lo resuelve express.static sirviendo public/index.html
router.get("/login", getLogin);
router.post("/login", limiteAutenticacion, postLogin);
router.post("/registro", limiteAutenticacion, register);
router.get("/logout", logout);
router.get("/politica-datos", getPolitica);
router.get("/terminos-venta", getTerminosVenta);
router.get("/aviso-privacidad", getAvisoPrivacidad);
router.get("/composicion-telas", getComposicionTelas);

// ============================================
// CUALQUIER USUARIO AUTENTICADO (usuario, moderador, admin)
// ============================================
router.get("/mi-panel", verificarSesion, getMiPanel);
router.get("/cuenta", verificarSesion, getCuenta);
router.post("/cuenta", verificarSesion, postCuenta);
router.post("/cuenta/eliminar", verificarSesion, postEliminarCuenta);
router.get("/pedidos", verificarSesion, getMisPedidos);

// ============================================
// MODERADOR Y ADMIN
// ============================================
router.get("/menu", ...soloStaff, getMenu);
router.get("/usuarios", ...soloStaff, getUsuarios);
router.get("/listar", ...soloStaff, getUsuarios);
router.get("/pedidos/todos", ...soloStaff, getTodosLosPedidos);
router.get("/pedidos/exportar.csv", ...soloStaff, getExportarPedidos);

// ============================================
// SOLO ADMIN (gestión de usuarios y roles)
// ============================================
router.get("/usuarios/nuevo", ...soloAdmin, getNuevoUsuario);
router.post("/usuarios/crear", ...soloAdmin, postCrearUsuario);
router.get("/usuarios/editar/:id", ...soloAdmin, getEditarUsuario);
router.post("/usuarios/editar", ...soloAdmin, postEditarUsuario);
router.post("/usuarios/eliminar", ...soloAdmin, postEliminarUsuario);
router.post("/admin/sesiones/cerrar", ...soloAdmin, postCerrarSesion);

// ============================================
// TIENDA (pública; confirmar pedido exige sesión)
// ============================================
router.get("/catalogo", getCatalogo);
router.get("/colecciones", getColecciones);
router.get("/carrito", getCarrito);
router.get("/checkout", getCheckout);
router.post("/checkout/confirmar", postConfirmarPedido);
router.post("/carrito/confirmar", postConfirmarPedido);
router.get("/conocenos", getConocenos);
router.get("/contacto", getContacto);

export default router;
