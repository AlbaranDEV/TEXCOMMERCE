/**
 * Middlewares de las vistas (patrón BFF)
 * - La identidad vive en req.session.usuario, en el servidor.
 * - El navegador solo tiene una cookie de sesión HttpOnly; nunca recibe el JWT.
 */
export function verificarSesion(req, res, next) {
    if (req.session?.usuario) {
        return next();
    }
    res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
}

// Autorización por rol: usar después de verificarSesion
export const permitirRolesVista = (...roles) => (req, res, next) => {
    if (roles.includes(req.session?.usuario?.rol)) {
        return next();
    }
    res.status(403).render("403", { usuario: req.session?.usuario || null });
};
