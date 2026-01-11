// server.js - Añade esto cerca del inicio
const express = require("express");
const cors = require("cors"); // <-- IMPORTANTE
const path = require("path");
const pool = require("./BD/BD");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CONFIGURAR CORS =====
app.use(cors());

// ===== MIDDLEWARE DE LOGGING =====
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Body:', req.body);
    }
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

// PROFESORES - con manejo de errores
try {
    const profesoresAPI = require('./APIS/profesores.api');
    app.use('/api/profesores', profesoresAPI);
    console.log('✅ API de profesores cargada exitosamente');
} catch (error) {
    console.error('❌ Error cargando API de profesores:', error.message);
    
    // API temporal
    const router = express.Router();
    router.get('*', (req, res) => {
        res.json({ 
            success: true, 
            message: 'API de profesores temporal',
            path: req.path 
        });
    });
    app.use('/api/profesores', router);
}

// ===== SALONES API =====
try {
    const salonesAPI = require('./APIS/salones.api');
    app.use('/api/salones', salonesAPI);
    console.log('✅ API de salones cargada');
} catch (error) {
    console.error('Error cargando salones.api:', error.message);
}

// Ruta de prueba general
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API funcionando',
        endpoints: [
            '/api/profesores/listar',
            '/api/profesores/registrar',
            '/api/profesores/buscar/:id',
            '/api/profesores/test'
        ]
    });
});

/* ===============================
   RUTAS DE VISTAS
================================ */

// Login principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

/* ===============================
   SERVIDOR
================================ */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor activo en puerto ${PORT}`);
    console.log('📋 Rutas disponibles:');
    console.log(`  http://localhost:${PORT}/api/test`);
    console.log(`  http://localhost:${PORT}/api/profesores/test`);
    console.log(`  http://localhost:${PORT}/api/profesores/listar`);
});