// DTOs: cada operación acepta solo una lista cerrada de campos (evita asignación masiva, API3:2023).
// Cualquier otro campo del cuerpo de la petición (por ejemplo rol o id) se ignora.

export const ROLES = ['admin', 'moderador', 'usuario'];

// NIST SP 800-63B-4: longitud mínima, sin reglas de composición y con lista de contraseñas comunes
const CONTRASENA_MIN = 12;
const CONTRASENA_MAX = 128;
const CONTRASENAS_COMUNES = new Set([
  '123456789012', 'contrasena123', 'contraseña123', 'password1234', 'qwertyuiop12',
  'texcommerce123', 'administrador', 'abcdefghijkl', '111111111111', '000000000000'
]);

export class ErrorValidacion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.status = 400;
  }
}

function texto(valor, campo, max) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new ErrorValidacion(`El campo ${campo} es obligatorio`);
  }
  const limpio = valor.trim();
  if (limpio.length > max) {
    throw new ErrorValidacion(`El campo ${campo} admite máximo ${max} caracteres`);
  }
  return limpio;
}

function correo(valor) {
  const limpio = texto(valor, 'correo', 100).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
    throw new ErrorValidacion('El correo no es válido');
  }
  return limpio;
}

function contrasena(valor, correoUsuario) {
  if (typeof valor !== 'string' || valor.length < CONTRASENA_MIN) {
    throw new ErrorValidacion(`La contraseña debe tener al menos ${CONTRASENA_MIN} caracteres`);
  }
  if (valor.length > CONTRASENA_MAX) {
    throw new ErrorValidacion(`La contraseña admite máximo ${CONTRASENA_MAX} caracteres`);
  }
  const normalizada = valor.toLowerCase();
  if (CONTRASENAS_COMUNES.has(normalizada) || (correoUsuario && normalizada === correoUsuario)) {
    throw new ErrorValidacion('Esa contraseña es demasiado común; elige otra');
  }
  return valor;
}

function rol(valor) {
  if (!ROLES.includes(valor)) {
    throw new ErrorValidacion(`El rol debe ser uno de: ${ROLES.join(', ')}`);
  }
  return valor;
}

function tieneValor(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// Registro público: el rol nunca viene del cliente
export function dtoRegistro(body = {}) {
  const nombre = texto(body.nombre, 'nombre', 50);
  const apellido = tieneValor(body.apellido) ? texto(body.apellido, 'apellido', 49) : '';
  const email = correo(body.correo);
  return {
    nombre: `${nombre} ${apellido}`.trim(),
    correo: email,
    contrasena: contrasena(body.contrasena, email)
  };
}

// Edición de la propia cuenta: solo nombre, correo y contraseña (nunca rol)
export function dtoPerfil(body = {}) {
  const dto = {
    nombre: texto(body.nombre, 'nombre', 100),
    correo: correo(body.correo)
  };
  if (tieneValor(body.contrasena)) {
    dto.contrasena = contrasena(body.contrasena, dto.correo);
  }
  return dto;
}

// Gestión de usuarios por un administrador: único DTO que acepta rol
export function dtoAdminUsuario(body = {}, { crear = false } = {}) {
  const dto = {
    nombre: texto(body.nombre, 'nombre', 100),
    correo: correo(body.correo),
    rol: rol(body.rol)
  };
  if (crear || tieneValor(body.contrasena)) {
    dto.contrasena = contrasena(body.contrasena, dto.correo);
  }
  return dto;
}

// Partidas del carrito: el precio nunca viene del cliente, se calcula en el servidor
export function dtoItemsPedido(body = {}) {
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0 || items.length > 50) {
    throw new ErrorValidacion('El pedido debe tener entre 1 y 50 productos');
  }
  return items.map((item) => {
    const metros = Number(item?.cantidad);
    if (!Number.isFinite(metros) || metros < 0.5 || metros > 1000) {
      throw new ErrorValidacion('La cantidad de cada producto debe estar entre 0.5 y 1000 metros');
    }
    return {
      codigo: texto(item?.codigo, 'codigo', 20),
      color: tieneValor(item?.color) ? texto(item.color, 'color', 30) : 'Estándar',
      metros
    };
  });
}

// Identificador numérico de ruta (/usuarios/:id)
export function idValido(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorValidacion('Identificador inválido');
  }
  return id;
}
