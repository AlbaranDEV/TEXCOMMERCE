import express from 'express';
import routeUsuario from './app/routes/usuario.js';
import routeAuth from './app/routes/auth.js'

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de usuario
app.use('/api', routeUsuario);

// Usar las rutas de auth
app.use('/api', routeAuth);


// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});