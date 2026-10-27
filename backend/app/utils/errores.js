// Respuesta de error para la API: los errores esperados (validación, negocio) muestran su mensaje;
// los inesperados se registran en el servidor y el cliente solo recibe un mensaje genérico.
export function responderError(res, error, contexto = 'Error') {
  if (error.status && error.status < 500) {
    return res.status(error.status).json({ error: error.message });
  }
  console.error(`${contexto}:`, error);
  return res.status(500).json({ error: 'Error interno del servidor' });
}
