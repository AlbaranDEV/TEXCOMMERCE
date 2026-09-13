import { Router } from "express";
import { 
    getLogin, postLogin,
    getMenu, logout,
    getUsuarios,
    getNuevoUsuario, postCrearUsuario,
    getEditarUsuario, postEditarUsuario,
    postEliminarUsuario,
    getCatalogo, getCarrito, getCheckout,
    getConocenos, getContacto,
    getColecciones
} from "../controllers/controller.views.js";
import { verificarSesion } from "../middleware/auth.middleware.js";

const router = Router();

// ============================================
// RUTAS DE AUTENTICACIÓN (sin protección)
// ============================================
// Nota: GET "/" lo resuelve express.static sirviendo public/index.html
// (el sitio TEXCOMERCE). El login del panel admin vive en /login.
router.get("/login", getLogin);
router.post("/login", postLogin);

// ============================================
// RUTAS PROTEGIDAS (requieren sesión)
// ============================================
router.get("/menu", verificarSesion, getMenu);
router.get("/logout", logout);

// CRUD de Usuarios
router.get("/usuarios", verificarSesion, getUsuarios);
router.get("/usuarios/nuevo", verificarSesion, getNuevoUsuario);
router.post("/usuarios/crear", verificarSesion, postCrearUsuario);
router.get("/usuarios/editar/:id", verificarSesion, getEditarUsuario);
router.post("/usuarios/editar", verificarSesion, postEditarUsuario);
router.post("/usuarios/eliminar", verificarSesion, postEliminarUsuario);

// ============================================
// RUTAS PÚBLICAS (E-COMMERCE)
// ============================================
router.get("/catalogo", getCatalogo);
router.get("/colecciones", getColecciones);
router.get("/carrito", getCarrito);
router.get("/checkout", getCheckout);
router.get("/conocenos", getConocenos);
router.get("/contacto", getContacto);

export default router;