import { Router } from 'express';
import { crearPedido, getPedidos, getTodosLosPedidos } from '../controllers/controller.pedido.js';
import { verificarToken, permitirRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/pedidos', verificarToken, crearPedido);
router.get('/pedidos', verificarToken, getPedidos);
router.get('/pedidos/todos', verificarToken, permitirRoles('admin', 'moderador'), getTodosLosPedidos);

export default router;
