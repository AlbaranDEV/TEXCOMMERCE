import * as pedidos from '../services/pedidos.service.js';
import { dtoItemsPedido } from '../utils/dto.js';
import { responderError } from '../utils/errores.js';

// POST /api/pedidos - Crea los pedidos del usuario autenticado (el id sale del token, no del cuerpo)
export const crearPedido = async (req, res) => {
  try {
    const { ids, total } = await pedidos.crearPedidos(req.usuario.id_usuario, dtoItemsPedido(req.body));
    res.status(201).json({
      message: 'Pedido registrado exitosamente',
      pedidosCreados: ids.length,
      ids,
      total
    });
  } catch (error) {
    responderError(res, error, 'Error al crear pedido');
  }
};

// GET /api/pedidos - Pedidos del usuario autenticado
export const getPedidos = async (req, res) => {
  try {
    res.json(await pedidos.listarDeUsuario(req.usuario.id_usuario));
  } catch (error) {
    responderError(res, error, 'Error al obtener pedidos');
  }
};

// GET /api/pedidos/todos - Todos los pedidos (moderador y admin)
export const getTodosLosPedidos = async (req, res) => {
  try {
    res.json(await pedidos.listarTodos());
  } catch (error) {
    responderError(res, error, 'Error al obtener todos los pedidos');
  }
};
