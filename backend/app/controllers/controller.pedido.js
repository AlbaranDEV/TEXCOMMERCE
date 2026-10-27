import pool from '../config/db.js';

// POST /api/pedidos - Crear uno o varios registros de pedido
export const crearPedido = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    const { items, producto, cantidad, total } = req.body;

    // Si viene un array de partidas del carrito
    if (items && Array.isArray(items) && items.length > 0) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        const createdIds = [];

        for (const item of items) {
          const descProducto = item.nombreCompleto || item.producto || `${item.nombre || 'Tela'} (${item.color || 'Estándar'})`;
          const cantMetros = Number(item.cantidad || item.metros || 1);
          const itemTotal = Number(item.subtotal || item.total || 0);

          const [result] = await connection.query(
            'INSERT INTO pedido (Id_usuario, producto, cantidad, Total, Fecha) VALUES (?, ?, ?, ?, CURDATE())',
            [id_usuario, descProducto.substring(0, 255), cantMetros, itemTotal]
          );
          createdIds.push(result.insertId);
        }

        await connection.commit();
        return res.status(201).json({
          message: 'Pedido registrado exitosamente',
          pedidosCreados: createdIds.length,
          ids: createdIds
        });
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }
    }

    // Si viene un pedido individual
    if (!producto || !cantidad) {
      return res.status(400).json({ error: 'Debe especificar producto y cantidad, o una lista de items' });
    }

    const [result] = await pool.query(
      'INSERT INTO pedido (Id_usuario, producto, cantidad, Total, Fecha) VALUES (?, ?, ?, ?, CURDATE())',
      [id_usuario, producto.substring(0, 255), Number(cantidad), Number(total || 0)]
    );

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      id_pedido: result.insertId
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al procesar el pedido en la base de datos' });
  }
};

// GET /api/pedidos - Listar los pedidos del usuario autenticado
export const getPedidos = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    const [rows] = await pool.query(
      'SELECT Id_pedido AS id_pedido, Id_usuario AS id_usuario, producto, cantidad, Total AS total, Fecha AS fecha FROM pedido WHERE Id_usuario = ? ORDER BY Id_pedido DESC',
      [id_usuario]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al consultar los pedidos' });
  }
};
