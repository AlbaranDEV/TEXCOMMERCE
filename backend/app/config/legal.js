import { POLITICA } from './politica.js';

// Textos legales del sitio.
// PLANTILLA: describen cómo funciona hoy la tienda, pero debe revisarlos el responsable
// legal de TEXCOMMERCE antes de publicarlos. Si cambias un texto, actualiza su fecha.
export const EMPRESA = {
  nombre: 'TEXCOMMERCE',
  ciudad: 'Bogotá, Colombia'
};

export const TERMINOS_VENTA = {
  titulo: 'Términos de venta',
  actualizado: '2026-10-27',
  intro: `Estas condiciones aplican a las compras de telas que realizas en el sitio de ${EMPRESA.nombre}. Al confirmar un pedido aceptas estos términos.`,
  secciones: [
    ['Productos', [
      'Vendemos telas por metro lineal. En la ficha de cada tela publicamos su composición, ancho y precio por metro.',
      'Cada tela se ofrece en los tonos que aparecen en el catálogo. El color puede variar ligeramente según la pantalla en la que lo veas.'
    ]],
    ['Precios e impuestos', [
      'Los precios se expresan en pesos colombianos (COP) por metro lineal.',
      'Al valor de los productos se suma el IVA del 19 %, que se muestra desglosado en el carrito antes de pagar.',
      'El precio que se cobra es el registrado en el catálogo en el momento de confirmar el pedido.'
    ]],
    ['Cantidades y corte', [
      'Puedes comprar desde 0,5 metros, en múltiplos de 0,5 metros.',
      'Las telas se cortan a la medida que solicitas.'
    ]],
    ['Cómo comprar', [
      'Para confirmar un pedido necesitas una cuenta y haber iniciado sesión.',
      'El pedido queda registrado al confirmarlo en el checkout. El pago se procesa a través de la pasarela Wompi.',
      'Puedes consultar tus pedidos en cualquier momento en la sección "Mis pedidos" de tu cuenta.'
    ]],
    ['Disponibilidad', [
      'Los pedidos están sujetos a la disponibilidad de inventario. Si una tela se agota después de tu compra, te contactaremos para ofrecerte una alternativa o la devolución de lo pagado.'
    ]],
    ['Entrega', [
      'Las condiciones, el costo y el plazo de entrega se coordinan contigo después de confirmar el pedido.'
    ]],
    ['Derecho de retracto', [
      'La Ley 1480 de 2011 (Estatuto del Consumidor) otorga, en las ventas a distancia, un derecho de retracto de cinco (5) días hábiles.',
      'El artículo 47 de esa ley exceptúa los bienes confeccionados conforme a las especificaciones del consumidor. Por eso, las telas cortadas a la medida que solicitas no admiten retracto, salvo que presenten defectos.'
    ]],
    ['Garantía', [
      'Las telas cuentan con la garantía legal de calidad e idoneidad establecida en la Ley 1480 de 2011.',
      'Si recibes una tela con defectos o distinta a la que pediste, contáctanos indicando el número de pedido para revisar el caso.'
    ]],
    ['Datos personales', [
      'Tratamos tus datos según nuestra política de tratamiento de datos personales, conforme a la Ley 1581 de 2012.'
    ]]
  ],
  enlaces: [['Política de tratamiento de datos', '/politica-datos'], ['Contacto', '/contacto']]
};

// Aviso de privacidad (Decreto 1377 de 2013, artículo 15)
export const AVISO_PRIVACIDAD = {
  titulo: 'Aviso de privacidad',
  actualizado: '2026-10-27',
  intro: `${EMPRESA.nombre}, con domicilio en ${EMPRESA.ciudad}, es responsable del tratamiento de los datos personales que recolecta a través de este sitio.`,
  secciones: [
    ['Datos que recolectamos', [
      'Nombre y correo electrónico al crear tu cuenta, y el historial de los pedidos que realizas.',
      'Al iniciar sesión registramos la fecha, la dirección IP y el tipo de navegador, con fines de seguridad de tu cuenta.'
    ]],
    ['Finalidad', [
      `${POLITICA.finalidad}.`
    ]],
    ['Tus derechos', [
      'Conocer, actualizar y rectificar tus datos.',
      'Solicitar prueba de la autorización que nos diste.',
      'Ser informado sobre el uso que damos a tus datos.',
      'Revocar la autorización o solicitar la supresión de tus datos.',
      'Presentar quejas ante la Superintendencia de Industria y Comercio.'
    ]],
    ['Cómo ejercerlos', [
      'Desde la sección "Mi cuenta" puedes consultar y actualizar tus datos, ver las autorizaciones que has dado y eliminar tu cuenta de inmediato.',
      'También puedes escribirnos desde la página de contacto. Respondemos las solicitudes dentro de los plazos de la Ley 1581 de 2012.'
    ]]
  ],
  enlaces: [['Política de tratamiento de datos completa', '/politica-datos'], ['Mi cuenta', '/cuenta'], ['Contacto', '/contacto']]
};
