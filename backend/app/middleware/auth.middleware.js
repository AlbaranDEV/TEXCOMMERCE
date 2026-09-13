import jwt from 'jsonwebtoken';

// Misma clave secreta usada en controller.auth.js
const SECRET = process.env.JWT_SECRET || 'mi_super_hiper_recontra_clave_secreta';

export const verificarToken = (req, res, next) => {
  try {
    // Leer el header authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    // Separar el token del prefijo "Bearer"
    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, SECRET);
    
    // Agregar datos del usuario al request para uso posterior
    req.usuario = decoded;
    
    // Continuar al siguiente middleware o controlador
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};