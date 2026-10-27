import crypto from 'crypto';
import argon2 from 'argon2';

// Argon2id según RFC 9106 (perfil de bajo consumo): 64 MiB de memoria, 3 iteraciones, 4 hilos
const ARGON2_OPCIONES = {
  type: argon2.argon2id,
  memoryCost: 64 * 1024,
  timeCost: 3,
  parallelism: 4
};

// Genera el hash Argon2id de una contraseña en texto plano
export function hashPassword(password) {
  return argon2.hash(password, ARGON2_OPCIONES);
}

// Formato antiguo "salt:hash" (scrypt), se acepta solo para migrar usuarios existentes
function verificarScrypt(password, stored) {
  const [salt, hash] = stored.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const verifyBuffer = crypto.scryptSync(password, salt, 64);
  return hashBuffer.length === verifyBuffer.length && crypto.timingSafeEqual(hashBuffer, verifyBuffer);
}

// Comparación en tiempo constante para contraseñas antiguas guardadas en texto plano
function compararPlano(password, stored) {
  const a = crypto.createHash('sha256').update(password).digest();
  const b = crypto.createHash('sha256').update(stored).digest();
  return crypto.timingSafeEqual(a, b);
}

// Verifica la contraseña contra Argon2id, scrypt o texto plano (estos dos últimos son heredados)
export async function passwordCoincide(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string' || !stored) {
    return false;
  }
  if (stored.startsWith('$argon2')) {
    try {
      return await argon2.verify(stored, password);
    } catch {
      return false;
    }
  }
  if (stored.includes(':')) {
    return verificarScrypt(password, stored);
  }
  return compararPlano(password, stored);
}

// true si la contraseña guardada no es Argon2id con los parámetros actuales
export function necesitaRehash(stored) {
  if (typeof stored !== 'string' || !stored.startsWith('$argon2id$')) {
    return true;
  }
  return argon2.needsRehash(stored, ARGON2_OPCIONES);
}
