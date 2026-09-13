import express from "express";
import session from "express-session";
import rutas from "./app/routes/routes.views.js";

const app = express();
const PORT = 4000;

// Configurar EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", "./views");

// Archivos estáticos (CSS, imágenes)
app.use(express.static("public"));

// Parseo de datos de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesiones (2 horas de duración)
app.use(session({
    secret: "mi_secreto_super_seguro",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
}));

// Registrar rutas
app.use("/", rutas);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor frontend corriendo en http://localhost:${PORT}`);
    console.log(`Asegúrate de que el backend esté corriendo en el puerto 3000`);
});