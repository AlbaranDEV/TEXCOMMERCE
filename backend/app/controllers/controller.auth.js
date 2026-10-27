import { autenticar } from '../services/usuarios.service.js';
import { firmarToken } from '../utils/jwt.js';
import { responderError } from '../utils/errores.js';

// POST /api/login - Para clientes externos de la API (no navegador).
// El navegador inicia sesión en POST /login y recibe solo una cookie de sesión.
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body || {};

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await autenticar(correo, contrasena);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.json({
      token: firmarToken(usuario),
      tipo: 'Bearer',
      expira_en: '2h',
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }
    });
  } catch (error) {
    responderError(res, error, 'Error en login de API');
  }
};
