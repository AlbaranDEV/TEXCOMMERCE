import { Router } from 'express';
import {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/controller.usuario.js';
import { verificarToken } from '../middleware/auth.middleware.js';


const router = Router();

// Todas las rutas protegidas con verificarToken
router.get('/usuarios', verificarToken, listarUsuarios);

router.get('/usuarios/:id', verificarToken, obtenerUsuario);

router.post('/usuarios', verificarToken, crearUsuario);

router.put('/usuarios/:id', verificarToken, actualizarUsuario);

router.delete('/usuarios/:id', verificarToken, eliminarUsuario);


export default router;