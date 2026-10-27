import crypto from 'crypto';
import pool from '../config/db.js';
import { ErrorNegocio } from './usuarios.service.js';

// Datos del panel de administración. Todo sale de la base de datos: no hay valores de ejemplo.

const VENTANA_COMPRA_MS = 5000;
const STOCK_BAJO_METROS = 20;
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Referencia no reversible del id de sesión: el id real nunca se envía al navegador
const referenciaSesion = (idSesion) => crypto.createHash('sha256').update(idSesion).digest('hex').slice(0, 16);

// "Seda Natural Premium (#SED-01) - Anil - 2 m" -> "Seda Natural Premium"
const nombreTela = (producto) => String(producto || '').split(' (')[0];

// Agrupa las partidas de un mismo checkout (mismo cliente, a 5 s o menos) en una compra
function agruparCompras(partidas) {
  const compras = [];
  const ultimaPorCliente = new Map();
  for (const partida of [...partidas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))) {
    const instante = new Date(partida.fecha).getTime();
    const ultima = ultimaPorCliente.get(partida.id_usuario);
    if (ultima && instante - ultima.instante <= VENTANA_COMPRA_MS) {
      ultima.total += Number(partida.total || 0);
      ultima.partidas += 1;
      ultima.instante = instante;
    } else {
      const compra = { id_usuario: partida.id_usuario, instante, total: Number(partida.total || 0), partidas: 1 };
      compras.push(compra);
      ultimaPorCliente.set(partida.id_usuario, compra);
    }
  }
  return compras;
}

export async function resumenVentas() {
  const [partidas] = await pool.query('SELECT id_usuario, producto, cantidad, total, created_at AS fecha FROM pedido');
  const compras = agruparCompras(partidas);
  const totalVentas = partidas.reduce((suma, p) => suma + Number(p.total || 0), 0);

  // Ventas por mes de los últimos 6 meses (incluidos los meses sin ventas)
  const hoy = new Date();
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({ clave: `${fecha.getFullYear()}-${fecha.getMonth()}`, etiqueta: `${MESES[fecha.getMonth()]} ${String(fecha.getFullYear()).slice(2)}`, total: 0, pedidos: 0 });
  }
  const porClave = new Map(meses.map((mes) => [mes.clave, mes]));
  for (const partida of partidas) {
    const fecha = new Date(partida.fecha);
    const mes = porClave.get(`${fecha.getFullYear()}-${fecha.getMonth()}`);
    if (mes) {
      mes.total += Number(partida.total || 0);
      mes.pedidos += 1;
    }
  }
  const maximoMes = Math.max(0, ...meses.map((mes) => mes.total));
  const mesActual = meses[meses.length - 1];
  const mesAnterior = meses[meses.length - 2];
  const variacion = mesAnterior.total > 0
    ? Math.round(((mesActual.total - mesAnterior.total) / mesAnterior.total) * 100)
    : null;

  // Telas más vendidas por ingresos
  const porTela = new Map();
  for (const partida of partidas) {
    const nombre = nombreTela(partida.producto);
    const actual = porTela.get(nombre) || { nombre, total: 0, partidas: 0 };
    actual.total += Number(partida.total || 0);
    actual.partidas += 1;
    porTela.set(nombre, actual);
  }
  const telasTop = [...porTela.values()].sort((a, b) => b.total - a.total).slice(0, 5);

  return {
    totalVentas,
    numeroCompras: compras.length,
    numeroPartidas: partidas.length,
    clientesCompradores: new Set(partidas.map((p) => p.id_usuario)).size,
    ticketPromedio: compras.length ? Math.round(totalVentas / compras.length) : 0,
    meses,
    maximoMes,
    mesActual,
    variacion,
    telasTop
  };
}

// Historial de pedidos con filtro de periodo: 'todos', '30d' o 'anio'
export async function historialPedidos(periodo = 'todos', limite = 25) {
  const filtros = {
    '30d': 'WHERE p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
    anio: 'WHERE YEAR(p.created_at) = YEAR(CURDATE())'
  };
  const [rows] = await pool.query(
    `SELECT p.id_pedido, p.id_usuario, u.nombre AS cliente, u.correo, p.producto, p.cantidad, p.total, p.created_at AS fecha
     FROM pedido p LEFT JOIN usuarios u ON u.id = p.id_usuario
     ${filtros[periodo] || ''}
     ORDER BY p.id_pedido DESC
     LIMIT ?`,
    [limite]
  );
  return rows;
}

export async function inventario() {
  const [rows] = await pool.query(
    'SELECT codigo, nombre, fibra, precio_metro, stock_metros FROM telas ORDER BY stock_metros ASC, nombre ASC'
  );
  return rows.map((tela) => ({ ...tela, stockBajo: Number(tela.stock_metros) < STOCK_BAJO_METROS }));
}

export async function resumenUsuarios() {
  const [porRol] = await pool.query('SELECT rol, COUNT(*) AS total FROM usuarios GROUP BY rol');
  const [recientes] = await pool.query(
    'SELECT id, nombre, correo, rol, created_at FROM usuarios ORDER BY created_at DESC, id DESC LIMIT 5'
  );
  const [[nuevos]] = await pool.query(
    'SELECT COUNT(*) AS total FROM usuarios WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
  );
  const conteo = { admin: 0, moderador: 0, usuario: 0 };
  for (const fila of porRol) conteo[fila.rol] = Number(fila.total);
  return {
    conteo,
    total: conteo.admin + conteo.moderador + conteo.usuario,
    nuevos30d: Number(nuevos.total),
    recientes
  };
}

// Sesiones no expiradas que pertenecen a un usuario autenticado
export async function sesionesActivas(idSesionActual) {
  const [rows] = await pool.query(
    'SELECT session_id, expires, data FROM sesiones WHERE expires > UNIX_TIMESTAMP() ORDER BY expires DESC'
  );
  return rows
    .map((fila) => {
      let datos;
      try {
        datos = JSON.parse(fila.data);
      } catch {
        return null;
      }
      if (!datos?.usuario) return null;
      return {
        ref: referenciaSesion(fila.session_id),
        actual: fila.session_id === idSesionActual,
        nombre: datos.usuario.nombre,
        correo: datos.usuario.correo,
        rol: datos.usuario.rol,
        inicio: datos.inicio || null,
        ip: datos.ip || null,
        navegador: datos.navegador || null,
        expira: new Date(Number(fila.expires) * 1000)
      };
    })
    .filter(Boolean);
}

// Cierra una sesión ajena a partir de su referencia (solo admin)
export async function cerrarSesion(ref, idSesionActual) {
  const [rows] = await pool.query('SELECT session_id FROM sesiones WHERE expires > UNIX_TIMESTAMP()');
  const objetivo = rows.find((fila) => referenciaSesion(fila.session_id) === ref);
  if (!objetivo) {
    throw new ErrorNegocio('La sesión ya no está activa', 404);
  }
  if (objetivo.session_id === idSesionActual) {
    throw new ErrorNegocio('No puedes cerrar tu propia sesión desde aquí; usa "Cerrar sesión"', 400);
  }
  await pool.query('DELETE FROM sesiones WHERE session_id = ?', [objetivo.session_id]);
}

// Indicadores de cumplimiento de la Ley 1581
export async function cumplimiento() {
  const [[datos]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM consentimientos) AS consentimientos,
       (SELECT COUNT(*) FROM usuarios u WHERE NOT EXISTS (SELECT 1 FROM consentimientos c WHERE c.id_usuario = u.id)) AS sin_consentimiento,
       (SELECT COUNT(*) FROM solicitudes_supresion) AS supresiones,
       (SELECT COUNT(*) FROM solicitudes_supresion WHERE estado = 'pendiente') AS supresiones_pendientes,
       (SELECT MIN(fecha_limite) FROM solicitudes_supresion WHERE estado = 'pendiente') AS proximo_vencimiento`
  );
  return {
    consentimientos: Number(datos.consentimientos),
    sinConsentimiento: Number(datos.sin_consentimiento),
    supresiones: Number(datos.supresiones),
    supresionesPendientes: Number(datos.supresiones_pendientes),
    proximoVencimiento: datos.proximo_vencimiento
  };
}

// Todos los pedidos en CSV (para contabilidad o respaldo)
export async function pedidosCsv() {
  const [rows] = await pool.query(
    `SELECT p.id_pedido, p.created_at, u.nombre, u.correo, p.producto, p.cantidad, p.total
     FROM pedido p LEFT JOIN usuarios u ON u.id = p.id_usuario
     ORDER BY p.id_pedido ASC`
  );
  // Evita inyección de fórmulas al abrir el archivo en Excel
  const celda = (valor) => {
    let texto = valor === null || valor === undefined ? '' : String(valor);
    if (/^[=+\-@]/.test(texto)) texto = `'${texto}`;
    return `"${texto.replace(/"/g, '""')}"`;
  };
  const encabezado = ['pedido', 'fecha', 'cliente', 'correo', 'producto', 'cantidad', 'total'];
  const lineas = rows.map((r) => [
    r.id_pedido,
    new Date(r.created_at).toISOString(),
    r.nombre ?? 'Cuenta eliminada',
    r.correo ?? '',
    r.producto,
    r.cantidad,
    r.total
  ].map(celda).join(','));
  return [encabezado.map(celda).join(','), ...lineas].join('\r\n');
}
