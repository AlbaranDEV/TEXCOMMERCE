import jwt from 'jsonwebtoken';

// Validación de JWT según RFC 8725: algoritmo fijo, emisor, audiencia y expiración obligatorios.
// Solo se aceptan tokens HS256; "alg: none" y cualquier otro algoritmo se rechazan.
const ALGORITMO = 'HS256';
const EMISOR = 'texcommerce';
const AUDIENCIA = 'texcommerce-api';
const DURACION = '2h';

function obtenerSecreto() {
  const secreto = process.env.JWT_SECRET;
  if (!secreto || secreto.length < 32) {
    throw new Error('JWT_SECRET no está definido o tiene menos de 32 caracteres');
  }
  return secreto;
}

// El token solo lleva el id (sub) y el rol; nunca datos personales ni contraseñas
export function firmarToken(usuario) {
  return jwt.sign(
    { rol: usuario.rol },
    obtenerSecreto(),
    {
      algorithm: ALGORITMO,
      issuer: EMISOR,
      audience: AUDIENCIA,
      subject: String(usuario.id),
      expiresIn: DURACION
    }
  );
}

// Devuelve { id_usuario, rol } o lanza un error si el token no es válido
export function verificarJwt(token) {
  const payload = jwt.verify(token, obtenerSecreto(), {
    algorithms: [ALGORITMO],
    issuer: EMISOR,
    audience: AUDIENCIA
  });

  if (!payload.exp || !payload.sub) {
    throw new Error('El token no incluye exp o sub');
  }

  return { id_usuario: Number(payload.sub), rol: payload.rol };
}
