import { Router } from 'express';
import {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/controller.usuario.js';
import { verificarToken, permitirRoles } from '../middleware/auth.middleware.js';

const router = Router();

// Todas requieren sesión o token. Las de :id validan además que el usuario sea el dueño
// del registro o tenga el rol adecuado (BOLA, ver controller.usuario.js)
router.get('/usuarios', verificarToken, permitirRoles('admin', 'moderador'), listarUsuarios);

router.get('/usuarios/:id', verificarToken, obtenerUsuario);

router.post('/usuarios', verificarToken, permitirRoles('admin'), crearUsuario);

router.put('/usuarios/:id', verificarToken, actualizarUsuario);

router.delete('/usuarios/:id', verificarToken, eliminarUsuario);

export default router;
