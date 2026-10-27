import crypto from 'crypto';
import pool from '../config/db.js';
import { POLITICA } from '../config/politica.js';
import { hashPassword, passwordCoincide, necesitaRehash } from '../utils/password.js';

// Columnas que pueden salir hacia el cliente: la contraseña nunca se selecciona
const CAMPOS_PUBLICOS = 'id, nombre, correo, rol, created_at';
const PLAZO_SUPRESION_DIAS = 15;

export class ErrorNegocio extends Error {
  constructor(mensaje, status = 409) {
    super(mensaje);
    this.status = status;
  }
}

// Hash de relleno: si el correo no existe se verifica igual, para no revelar
// qué correos están registrados por diferencias de tiempo
let hashRelleno;
const obtenerHashRelleno = () => (hashRelleno ??= hashPassword(crypto.randomBytes(16).toString('hex')));

// Devuelve el usuario sin contraseña, o null si las credenciales no son válidas.
// Las contraseñas antiguas (texto plano o scrypt) se migran a Argon2id al iniciar sesión.
export async function autenticar(correo, contrasena) {
  const [rows] = await pool.query(
    'SELECT id, nombre, correo, rol, contrasena FROM usuarios WHERE correo = ?',
    [String(correo || '').trim()]
  );
  const usuario = rows[0];
  const valida = await passwordCoincide(String(contrasena || ''), usuario ? usuario.contrasena : await obtenerHashRelleno());

  if (!usuario || !valida) {
    return null;
  }

  if (necesitaRehash(usuario.contrasena)) {
    await pool.query('UPDATE usuarios SET contrasena = ? WHERE id = ?', [await hashPassword(contrasena), usuario.id]);
  }

  const { contrasena: _omitida, ...publico } = usuario;
  return publico;
}

export async function listar() {
  const [rows] = await pool.query(`SELECT ${CAMPOS_PUBLICOS} FROM usuarios ORDER BY id ASC`);
  return rows;
}

export async function obtener(id) {
  const [rows] = await pool.query(`SELECT ${CAMPOS_PUBLICOS} FROM usuarios WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function verificarCorreoLibre(correo, idExcluido = 0) {
  const [rows] = await pool.query('SELECT id FROM usuarios WHERE correo = ? AND id <> ?', [correo, idExcluido]);
  if (rows.length > 0) {
    throw new ErrorNegocio('El correo ya está registrado');
  }
}

// Impide dejar el sistema sin ningún administrador
async function verificarNoEsUltimoAdmin(id) {
  const [rows] = await pool.query(
    "SELECT (SELECT rol FROM usuarios WHERE id = ?) AS rol, (SELECT COUNT(*) FROM usuarios WHERE rol = 'admin') AS admins",
    [id]
  );
  if (rows[0].rol === 'admin' && Number(rows[0].admins) <= 1) {
    throw new ErrorNegocio('No se puede quitar ni eliminar al único administrador');
  }
}

// Alta por un administrador (dto ya validado con dtoAdminUsuario)
export async function crear(dto) {
  await verificarCorreoLibre(dto.correo);
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
    [dto.nombre, dto.correo, await hashPassword(dto.contrasena), dto.rol]
  );
  return obtener(result.insertId);
}

// Actualiza solo los campos presentes en el DTO (dtoPerfil o dtoAdminUsuario)
export async function actualizar(id, dto) {
  const actual = await obtener(id);
  if (!actual) {
    throw new ErrorNegocio('Usuario no encontrado', 404);
  }
  await verificarCorreoLibre(dto.correo, id);
  if (dto.rol && dto.rol !== 'admin') {
    await verificarNoEsUltimoAdmin(id);
  }

  const campos = ['nombre = ?', 'correo = ?'];
  const valores = [dto.nombre, dto.correo];
  if (dto.rol) {
    campos.push('rol = ?');
    valores.push(dto.rol);
  }
  if (dto.contrasena) {
    campos.push('contrasena = ?');
    valores.push(await hashPassword(dto.contrasena));
  }

  await pool.query(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, [...valores, id]);
  return obtener(id);
}

// Registro público con consentimiento informado, en una sola transacción
export async function registrar(dto, { ip, userAgent }) {
  await verificarCorreoLibre(dto.correo);
  const contrasenaHash = await hashPassword(dto.contrasena);

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const [result] = await conexion.query(
      "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, 'usuario')",
      [dto.nombre, dto.correo, contrasenaHash]
    );
    await conexion.query(
      'INSERT INTO consentimientos (id_usuario, version_politica, hash_politica, finalidad, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [result.insertId, POLITICA.version, POLITICA.hash, POLITICA.finalidad, String(ip || '').slice(0, 45), String(userAgent || '').slice(0, 255)]
    );
    await conexion.commit();
    return result.insertId;
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

export async function consentimientosDe(id) {
  const [rows] = await pool.query(
    'SELECT version_politica, finalidad, aceptado_en FROM consentimientos WHERE id_usuario = ? ORDER BY aceptado_en DESC',
    [id]
  );
  return rows;
}

// Derecho de supresión: borra la cuenta (y sus pedidos, por la llave foránea) y deja constancia
// de la solicitud sin conservar el correo en claro
export async function suprimir(id) {
  const usuario = await obtener(id);
  if (!usuario) {
    throw new ErrorNegocio('Usuario no encontrado', 404);
  }
  await verificarNoEsUltimoAdmin(id);

  const correoHash = crypto.createHash('sha256').update(usuario.correo.toLowerCase()).digest('hex');
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    await conexion.query(
      `INSERT INTO solicitudes_supresion (id_usuario, correo_hash, estado, fecha_limite, completada_en)
       VALUES (?, ?, 'completada', DATE_ADD(CURDATE(), INTERVAL ? DAY), CURRENT_TIMESTAMP)`,
      [id, correoHash, PLAZO_SUPRESION_DIAS]
    );
    await conexion.query('DELETE FROM usuarios WHERE id = ?', [id]);
    await conexion.commit();
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}
