import * as usuarios from '../services/usuarios.service.js';
import { dtoAdminUsuario, dtoPerfil, idValido } from '../utils/dto.js';
import { responderError } from '../utils/errores.js';

const esStaff = (rol) => rol === 'admin' || rol === 'moderador';

// GET /api/usuarios - moderador y admin (solo lectura para moderador)
export const listarUsuarios = async (req, res) => {
  try {
    res.json(await usuarios.listar());
  } catch (error) {
    responderError(res, error, 'Error al listar usuarios');
  }
};

// GET /api/usuarios/:id - BOLA: un usuario solo puede ver su propio registro
export const obtenerUsuario = async (req, res) => {
  try {
    const id = idValido(req.params.id);
    if (!esStaff(req.usuario.rol) && id !== req.usuario.id_usuario) {
      return res.status(403).json({ error: 'Solo puedes consultar tu propia cuenta' });
    }

    const usuario = await usuarios.obtener(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    responderError(res, error, 'Error al obtener usuario');
  }
};

// POST /api/usuarios - solo admin
export const crearUsuario = async (req, res) => {
  try {
    const usuario = await usuarios.crear(dtoAdminUsuario(req.body, { crear: true }));
    res.status(201).json(usuario);
  } catch (error) {
    responderError(res, error, 'Error al crear usuario');
  }
};

// PUT /api/usuarios/:id - admin edita cualquiera (incluido el rol);
// el dueño de la cuenta solo edita nombre, correo y contraseña (DTO sin rol)
export const actualizarUsuario = async (req, res) => {
  try {
    const id = idValido(req.params.id);
    const esAdmin = req.usuario.rol === 'admin';
    if (!esAdmin && id !== req.usuario.id_usuario) {
      return res.status(403).json({ error: 'Solo puedes modificar tu propia cuenta' });
    }

    const dto = esAdmin ? dtoAdminUsuario(req.body) : dtoPerfil(req.body);
    res.json(await usuarios.actualizar(id, dto));
  } catch (error) {
    responderError(res, error, 'Error al actualizar usuario');
  }
};

// DELETE /api/usuarios/:id - admin elimina cualquiera; el dueño ejerce su derecho de supresión
export const eliminarUsuario = async (req, res) => {
  try {
    const id = idValido(req.params.id);
    if (req.usuario.rol !== 'admin' && id !== req.usuario.id_usuario) {
      return res.status(403).json({ error: 'Solo puedes eliminar tu propia cuenta' });
    }

    await usuarios.suprimir(id);
    if (id === req.usuario.id_usuario && req.session) {
      req.session.destroy(() => {});
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    responderError(res, error, 'Error al eliminar usuario');
  }
};
