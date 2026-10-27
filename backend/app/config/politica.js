import crypto from 'crypto';

// Política de tratamiento de datos personales (Ley 1581 de 2012).
// PLANTILLA: debe revisarla el responsable legal de TEXCOMMERCE antes de publicarla.
// Si cambias el texto, sube la versión: los usuarios nuevos quedarán registrados con la nueva.
export const POLITICA = {
  version: '1.0',
  finalidad: 'Gestión de la cuenta, procesamiento de pedidos y contacto comercial',
  parrafos: [
    'TEXCOMMERCE es responsable del tratamiento de los datos personales que entregas al registrarte: nombre, correo electrónico e historial de pedidos.',
    'Usamos tus datos únicamente para gestionar tu cuenta, procesar y entregar tus pedidos y comunicarnos contigo sobre ellos. No vendemos ni cedemos tus datos a terceros.',
    'Como titular tienes derecho a conocer, actualizar y rectificar tus datos, solicitar prueba de esta autorización, ser informado sobre su uso, presentar quejas ante la Superintendencia de Industria y Comercio y revocar la autorización o pedir la supresión de tus datos.',
    'Puedes consultar y actualizar tus datos, y eliminar tu cuenta, desde la sección "Mi cuenta". Las solicitudes de supresión se atienden en un plazo máximo de 15 días hábiles.',
    'Tu contraseña se almacena con un algoritmo de hash irreversible (Argon2id) y la comunicación con el sitio está cifrada.'
  ]
};

// Huella del texto aceptado: permite demostrar qué versión exacta autorizó el titular
POLITICA.hash = crypto
  .createHash('sha256')
  .update(`${POLITICA.version}\n${POLITICA.finalidad}\n${POLITICA.parrafos.join('\n')}`)
  .digest('hex');
