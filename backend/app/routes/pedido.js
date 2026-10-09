import { Router } from 'express';
import { crearPedido, getPedidos } from '../controllers/controller.pedido.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/pedidos', verificarToken, crearPedido);
router.get('/pedidos', verificarToken, getPedidos);

export default router;
