import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { verifyPassword } from '../utils/password.js';

// Clave secreta (en producción usar process.env.JWT_SECRET)
const SECRET = process.env.JWT_SECRET || 'mi_super_hiper_recontra_clave_secreta';

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    // Buscar al usuario por correo
    const [rows] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];
    const passwordValida = verifyPassword(contrasena, usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token (el payload no debe contener contraseñas)
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

    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
