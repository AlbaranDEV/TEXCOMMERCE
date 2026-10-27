import express from 'express';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Los secretos son obligatorios: sin ellos la app no arranca (nada de claves por defecto en el código)
for (const variable of ['JWT_SECRET', 'SESSION_SECRET']) {
  if (!process.env[variable] || process.env[variable].length < 32) {
    throw new Error(`Falta la variable de entorno ${variable} (mínimo 32 caracteres)`);
  }
}

const enProduccion = process.env.NODE_ENV === 'production';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Vercel termina HTTPS en su proxy: necesario para que las cookies Secure funcionen
app.set('trust proxy', 1);

// Cabeceras de seguridad: HSTS, nosniff, CSP, anti-clickjacking, sin X-Powered-By
app.use(helmet({
  strictTransportSecurity: { maxAge: 63072000, includeSubDomains: true, preload: true },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Las vistas usan scripts en línea y Tailwind desde CDN; Wompi para pagos
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://checkout.wompi.co'],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://lh3.googleusercontent.com'],
      connectSrc: ["'self'", 'https://*.wompi.co'],
      frameSrc: ['https://checkout.wompi.co'],
      formAction: ["'self'", 'https://checkout.wompi.co'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: enProduccion ? [] : null
    }
  }
}));

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend', 'views'));

// Archivos estáticos públicos (CSS, imágenes, scripts frontend)
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Parseo de cuerpo de solicitudes (con límite de tamaño)
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));

// Sesiones guardadas en MySQL: en Vercel la memoria del servidor no se conserva entre peticiones.
// La cookie solo lleva un identificador opaco; los datos (y nunca un JWT) quedan en el servidor.
import pool from './backend/app/config/db.js';
const MySQLStore = MySQLStoreFactory(session);
const almacenSesiones = new MySQLStore({
  createDatabaseTable: false,
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000,
  schema: { tableName: 'sesiones' }
}, pool.pool);

// El prefijo __Host- exige HTTPS, Path=/ y sin Domain: solo se puede usar en producción
app.set('nombreCookieSesion', enProduccion ? '__Host-texcommerce.sid' : 'texcommerce.sid');

app.use(session({
  name: app.get('nombreCookieSesion'),
  secret: process.env.SESSION_SECRET,
  store: almacenSesiones,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: enProduccion,
    sameSite: 'strict',
    path: '/',
    maxAge: 2 * 60 * 60 * 1000 // 2 horas
  }
}));

// Importar rutas de Backend (/api)
import routeUsuario from './backend/app/routes/usuario.js';
import routeAuth from './backend/app/routes/auth.js';
import routeTelas from './backend/app/routes/telas.js';
import routePedido from './backend/app/routes/pedido.js';

app.use('/api', routeUsuario);
app.use('/api', routeAuth);
app.use('/api', routeTelas);
app.use('/api', routePedido);

// Importar rutas de Frontend (Vistas EJS)
import rutasFrontend from './frontend/app/routes/routes.views.js';
app.use('/', rutasFrontend);

// Exportar la aplicación para Vercel Serverless Function
export default app;

// Mantener escucha en puerto para desarrollo local
if (!enProduccion) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor TEXCOMMERCE corriendo localmente en http://localhost:${PORT}`);
  });
}
