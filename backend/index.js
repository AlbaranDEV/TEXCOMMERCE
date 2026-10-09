import express from 'express';
import routeUsuario from './app/routes/usuario.js';
import routeAuth from './app/routes/auth.js';
import routeTelas from './app/routes/telas.js';
import routePedido from './app/routes/pedido.js';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de usuario
app.use('/api', routeUsuario);

// Usar las rutas de auth
app.use('/api', routeAuth);

// Usar las rutas de telas del catálogo
app.use('/api', routeTelas);

// Usar las rutas de pedidos
app.use('/api', routePedido);


// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});