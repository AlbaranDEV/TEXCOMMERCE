import pool from '../config/db.js';
import { hashPassword } from '../utils/password.js';

// Quita la contraseña (hash) antes de devolver datos al frontend
const sinContrasena = (usuario) => {
  const { contrasena, ...resto } = usuario;
  return resto;
};

// Obtener todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {

    const [rows] = await pool.query('SELECT * FROM usuarios');

    res.json(rows.map(sinContrasena));

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// Obtener un usuario por ID
export const obtenerUsuario = async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await pool.query(

      'SELECT * FROM usuarios WHERE id = ?',

      [id]

    );

    if (rows.length === 0) {

      return res.status(404).json({ error: 'Usuario no encontrado' });

    }

    res.json(sinContrasena(rows[0]));

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};

// Crear nuevo usuario
export const crearUsuario = async (req, res) => {
  try {

    const { nombre, correo, contrasena, rol } = req.body;

    if (!contrasena) {
      return res.status(400).json({ error: 'La contraseña es obligatoria' });
    }

    const contrasenaHasheada = hashPassword(contrasena);

    const [result] = await pool.query(

      'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',

      [nombre, correo, contrasenaHasheada, rol]

    );

    res.status(201).json({

      id: result.insertId,

      nombre,
      correo,
      rol

    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {

    const { id } = req.params;

    const { nombre, correo, contrasena, rol } = req.body;

    // Si no se envía una contraseña nueva, se conserva la actual.
    // Esto evita exponer el hash existente en el formulario de edición.
    if (contrasena && contrasena.trim() !== '') {

      const contrasenaHasheada = hashPassword(contrasena);

      await pool.query(
        'UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, rol = ? WHERE id = ?',
        [nombre, correo, contrasenaHasheada, rol, id]
      );

    } else {

      await pool.query(
        'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
        [nombre, correo, rol, id]
      );

    }

    res.json({ message: 'Usuario actualizado correctamente' });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

    res.json({ message: 'Usuario eliminado correctamente' });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};
