/**
 * Middleware para verificar si existe una sesión activa
 * Este middleware es diferente al del backend:
 * - Aquí verificamos req.session.token (sesión del servidor)
 * - No verificamos el JWT directamente, eso lo hace el backend
 */
export function verificarSesion(req, res, next) {
    if (req.session.token) {
        // El usuario tiene sesión activa, continuar
        next();
    } else {
        // No hay sesión, redirigir al login
        res.redirect("/login");
    }
}