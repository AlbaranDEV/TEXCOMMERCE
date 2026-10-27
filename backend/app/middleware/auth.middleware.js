import { verificarJwt } from '../utils/jwt.js';

// Autenticación de la API.
// - Navegador (patrón BFF): se identifica con la cookie de sesión; el JWT nunca llega al navegador.
// - Clientes externos (Postman, apps): envían "Authorization: Bearer <token>" obtenido en POST /api/login.
export const verificarToken = (req, res, next) => {
  if (req.session?.usuario) {
    req.usuario = { id_usuario: req.session.usuario.id_usuario, rol: req.session.usuario.rol };
    return next();
  }

  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    req.usuario = verificarJwt(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Autorización por rol: usar después de verificarToken
export const permitirRoles = (...roles) => (req, res, next) => {
  if (req.usuario && roles.includes(req.usuario.rol)) {
    return next();
  }
  return res.status(403).json({ error: 'No tienes permiso para esta acción' });
};

export const verificarAdmin = permitirRoles('admin');
