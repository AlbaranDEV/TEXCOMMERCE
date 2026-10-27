import rateLimit from 'express-rate-limit';

// Limita los intentos de inicio de sesión y registro por IP (fuerza bruta y relleno de credenciales)
export const limiteAutenticacion = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  // Solo cuentan los intentos fallidos: un inicio de sesión correcto no consume el cupo
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' }
});
