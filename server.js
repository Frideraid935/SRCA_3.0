const express = require("express");
const cors = require("cors"); // <-- AÑADE ESTO
const path = require("path");
const pool = require("./BD/BD");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CONFIGURAR CORS (CRÍTICO) =====
app.use(cors()); // <-- ESTA LÍNEA ES ESENCIAL

// ===== MIDDLEWARE DE LOGGING =====
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// ===== MIDDLEWARE PARA VER RESPUESTAS (MODIFICADO) =====
app.use((req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.json = function(data) {
        console.log(`Respuesta JSON para ${req.method} ${req.url}:`, JSON.stringify(data, null, 2));
        return originalJson.call(this, data);
    };
    
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "publico")));

/* ===============================
   RUTAS API
================================ */

// Login
const loginApi = require("./APIS/login.api");
app.use("/api", loginApi);

// Alumnos (CRUD + listar)
const alumnosApi = require("./APIS/alumnos.api");
app.use("/api/alumnos", alumnosApi);

// Importar rutas de materias
const materiasAPI = require('./APIS/materias.api.js');
app.use('/api/materias', materiasAPI);

const adminApi = require("./APIS/admin.api");
app.use("/api/admin", adminApi);

const calificacionesAPI = require('./APIS/calificaciones.api');
app.use('/api/calificaciones', calificacionesAPI);

const profesoresAPI = require('./APIS/profesores.api');
app.use('/api/profesores', profesoresAPI);

// ===== SALONES API =====
console.log('Registrando API de salones...');
try {
    const salonesAPI = require('./APIS/salones.api');
    app.use('/api/salones', salonesAPI);
    console.log('API de salones registrada exitosamente');
} catch (error) {
    console.error('Error cargando salones.api:', error.message);
    
    // Ruta de emergencia
    app.get('/api/salones/buscar/:id', (req, res) => {
        console.log('Ruta de emergencia ejecutada para:', req.params.id);
        res.status(503).json({
            success: false,
            message: 'Modulo salones temporalmente no disponible'
        });
    });
}

// ===== RUTA DE PRUEBA PARA CORS =====
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando con CORS',
        timestamp: new Date().toISOString()
    });
});

/* ===============================
   RUTAS DE VISTAS
================================ */

// Login principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

// Ruta para servir archivos HTML desde cualquier directorio
app.get('*.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'publico', req.path));
});

// Manejo de errores 404
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

/* ===============================
   SERVIDOR
================================ */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor activo en puerto ${PORT}`);
    console.log('Rutas disponibles:');
    console.log(`  http://localhost:${PORT}/api/salones/buscar/1`);
    console.log(`  http://localhost:${PORT}/api/test (para probar CORS)`);
    console.log(`  http://localhost:${PORT}/api/profesores/registrar`);
});