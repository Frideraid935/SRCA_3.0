const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./BD/BD");

const app = express();
const PORT = process.env.PORT || 8080;

// Configurar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "publico")));

/* ===============================
   RUTAS API
================================ */

// Login
const loginApi = require("./APIS/login.api");
app.use("/api", loginApi);

// Alumnos
const alumnosApi = require("./APIS/alumnos.api");
app.use("/api/alumnos", alumnosApi);

// Materias
const materiasAPI = require('./APIS/materias.api.js');
app.use('/api/materias', materiasAPI);

// Admin
const adminApi = require("./APIS/admin.api");
app.use("/api/admin", adminApi);

// Calificaciones
const calificacionesAPI = require('./APIS/calificaciones.api');
app.use('/api/calificaciones', calificacionesAPI);

// Profesores
try {
    const profesoresAPI = require('./APIS/profesores.api');
    app.use('/api/profesores', profesoresAPI);
    console.log('API de profesores cargada exitosamente');
} catch (error) {
    console.error('Error cargando API de profesores:', error.message);
}

// Salones
try {
    const salonesAPI = require('./APIS/salones.api');
    app.use('/api/salones', salonesAPI);
} catch (error) {
    console.error('Error cargando salones.api:', error.message);
}

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API funcionando'
    });
});

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});