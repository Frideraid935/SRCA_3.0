const express = require("express");
const path = require("path");
const pool = require("./BD/BD");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== SOLO ESTO FALTA - MIDDLEWARE PARA RAILWAY =====
app.use((req, res, next) => {
    // Headers CORS mínimos
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "publico")));

// ===== RUTA DE PRUEBA SIMPLE - Para diagnosticar =====
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'API funcionando',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/salones/test/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: 'Ruta de prueba salones',
        id: id,
        salon: {
            id: parseInt(id),
            nombre: `Salón Test ${id}`,
            capacidad: 30,
            profesor_id: 'TEST001'
        }
    });
});

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

// ===== IMPORTANTE: SALONES API =====
try {
    const salonesAPI = require('./APIS/salones.api');
    app.use('/api/salones', salonesAPI);
    console.log('✅ API de salones registrada: /api/salones/*');
} catch (error) {
    console.error('❌ Error cargando salones.api:', error.message);
    
    // Rutas de emergencia si falla
    app.get('/api/salones/buscar/:id', (req, res) => {
        res.status(503).json({
            success: false,
            message: 'Módulo salones no disponible',
            error: error.message
        });
    });
}

/* ===============================
   RUTAS DE VISTAS
================================ */

// Login principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

// Ruta 404 para API
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta API no encontrada: ${req.method} ${req.originalUrl}`
    });
});

/* ===============================
   SERVIDOR
================================ */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor activo en puerto ${PORT}`);
    console.log(`🔗 Endpoints disponibles:`);
    console.log(`   http://localhost:${PORT}/api/test`);
    console.log(`   http://localhost:${PORT}/api/salones/test/1`);
    console.log(`   http://localhost:${PORT}/api/salones/buscar/1`);
});