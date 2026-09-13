import crypto from 'crypto';

const KEY_LENGTH = 64;

// Genera "salt:hash" a partir de una contraseña en texto plano
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

// Compara una contraseña en texto plano contra el "salt:hash" guardado
export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) {
    return false;
  }

  const [salt, hash] = stored.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const verifyBuffer = crypto.scryptSync(password, salt, KEY_LENGTH);

  if (hashBuffer.length !== verifyBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, verifyBuffer);
}
