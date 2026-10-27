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

    // Buscar al usuario por email en la tabla usuarios
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];
    // Cambia la validación temporalmente para comparar directo:
    const passwordValida = (contrasena === usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token (el payload no debe contener contraseñas)
    const token = jwt.sign({
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido, 
        correo: usuario.correo,
        rol: usuario.rol
    }, SECRET, { expiresIn: '2h' });

    // Si el usuario es administrador, lo mandamos al panel de listar/crear (vistas de administración)
    if (usuario.rol === 'admin') {
        return res.redirect('/listar'); // O la ruta de administración que maneje tu proyecto
    } else {
        return res.redirect('/catalogo');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REGISTRO DE NUEVOS USUARIOS
export const register = async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasena } = req.body;

        // Validar que todos los campos obligatorios estén llenos
        if (!nombre || !apellido || !correo || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si el correo ya existe en la base de datos
        const [existing] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Insertar el nuevo usuario en la base de datos unificada (con rol 'cliente' por defecto)
        await pool.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, correo, contrasena, 'cliente']
        );

        // Redirigir al login tras un registro exitoso
        res.redirect('/login');
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};
