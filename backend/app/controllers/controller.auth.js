import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { hashPassword, passwordCoincide } from '../utils/password.js';

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
    const passwordValida = passwordCoincide(contrasena, usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token (el payload no debe contener contraseñas)
    const token = jwt.sign({
        id_usuario: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    }, SECRET, { expiresIn: '2h' });

    // Guardar la sesión para que las vistas reconozcan al usuario
    req.session.token = token;
    req.session.usuario = {
        id_usuario: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    };

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
        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si el correo ya existe en la base de datos
        const [existing] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // La tabla no tiene columna de apellido: se guarda junto al nombre
        const nombreCompleto = `${nombre} ${apellido || ''}`.trim().substring(0, 100);

        // Insertar el nuevo usuario con rol 'usuario' por defecto
        await pool.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
            [nombreCompleto, correo, hashPassword(contrasena), 'usuario']
        );

        // Redirigir al login tras un registro exitoso
        res.redirect('/login');
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};
