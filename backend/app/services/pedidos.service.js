import pool from '../config/db.js';
import { ErrorValidacion } from '../utils/dto.js';

// Crea los pedidos de un carrito. El precio se toma de la tabla telas, nunca del cliente.
// items: salida de dtoItemsPedido -> [{ codigo, color, metros }]
export async function crearPedidos(idUsuario, items) {
  const codigos = [...new Set(items.map((item) => item.codigo))];
  const [telas] = await pool.query('SELECT codigo, nombre, precio_metro FROM telas WHERE codigo IN (?)', [codigos]);
  const precios = new Map(telas.map((tela) => [tela.codigo, tela]));

  const partidas = items.map((item) => {
    const tela = precios.get(item.codigo);
    if (!tela) {
      throw new ErrorValidacion(`La tela ${item.codigo} no existe`);
    }
    return {
      // La columna cantidad es entera: los metros exactos quedan en la descripción
      producto: `${tela.nombre} (${tela.codigo}) - ${item.color} - ${item.metros} m`.slice(0, 100),
      cantidad: Math.ceil(item.metros),
      total: Math.round(item.metros * Number(tela.precio_metro))
    };
  });

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const ids = [];
    for (const partida of partidas) {
      const [result] = await conexion.query(
        'INSERT INTO pedido (id_usuario, producto, cantidad, total) VALUES (?, ?, ?, ?)',
        [idUsuario, partida.producto, partida.cantidad, partida.total]
      );
      ids.push(result.insertId);
    }
    await conexion.commit();
    return { ids, total: partidas.reduce((suma, partida) => suma + partida.total, 0) };
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

export async function listarDeUsuario(idUsuario) {
  const [rows] = await pool.query(
    'SELECT id_pedido, producto, cantidad, total, created_at AS fecha FROM pedido WHERE id_usuario = ? ORDER BY id_pedido DESC',
    [idUsuario]
  );
  return rows;
}

// Las partidas de un mismo checkout se guardan como filas separadas casi en el mismo instante:
// se agrupan en una "compra" si están a 5 segundos o menos entre sí
const VENTANA_COMPRA_MS = 5000;

// Resumen para el panel del cliente: compras agrupadas, totales y tela más comprada
export async function resumenDeUsuario(idUsuario) {
  const partidas = await listarDeUsuario(idUsuario);

  const compras = [];
  for (const partida of partidas) {
    const instante = new Date(partida.fecha).getTime();
    const actual = compras[compras.length - 1];
    if (actual && Math.abs(actual.instante - instante) <= VENTANA_COMPRA_MS) {
      actual.partidas.push(partida);
      actual.total += Number(partida.total || 0);
    } else {
      compras.push({ instante, fecha: partida.fecha, partidas: [partida], total: Number(partida.total || 0) });
    }
  }

  // "Seda Natural Premium (#SED-01) - Anil - 2 m" -> "Seda Natural Premium"
  const conteo = new Map();
  for (const partida of partidas) {
    const nombre = partida.producto.split(' (')[0];
    conteo.set(nombre, (conteo.get(nombre) || 0) + 1);
  }
  const [favorita] = [...conteo].sort((a, b) => b[1] - a[1]);

  return {
    compras,
    numeroCompras: compras.length,
    numeroProductos: partidas.length,
    totalGastado: compras.reduce((suma, compra) => suma + compra.total, 0),
    ultimaCompra: compras[0]?.fecha || null,
    telaFavorita: favorita ? favorita[0] : null
  };
}

// Solo para moderador y administrador
export async function listarTodos() {
  const [rows] = await pool.query(
    `SELECT p.id_pedido, p.id_usuario, u.nombre AS cliente, p.producto, p.cantidad, p.total, p.created_at AS fecha
     FROM pedido p LEFT JOIN usuarios u ON u.id = p.id_usuario
     ORDER BY p.id_pedido DESC`
  );
  return rows;
}
