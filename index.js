import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend', 'views'));

// Archivos estáticos públicos (CSS, imágenes, scripts frontend)
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Parseo de cuerpo de solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'texcommerce_super_secret_key_2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
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
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor TEXCOMMERCE corriendo localmente en http://localhost:${PORT}`);
  });
}
