const express = require("express");
const path = require("path");
const session = require('express-session'); // <-- AGREGAR ESTO
const pool = require("./BD/BD");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CONFIGURAR SESIONES 
app.use(session({
  secret: 'srca_secret_key_' + Date.now(), // Clave secreta
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Cambia a true si usas HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    httpOnly: true
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "publico")));

// Middleware para debug de sesiones
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} - Sesión ID: ${req.sessionID}`);
  next();
});

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
const materiasRoutes = require('./APIS/materias.api.js');
app.use('/api/materias', materiasRoutes);

// Ruta para verificar sesión (agregar temporalmente)
app.get("/api/check-session", (req, res) => {
  console.log("Verificando sesión:", req.session.user || "No hay usuario");
  if (req.session.user) {
    res.json({ 
      loggedIn: true, 
      user: req.session.user 
    });
  } else {
    res.json({ 
      loggedIn: false 
    });
  }
});

/* ===============================
   RUTAS DE VISTAS
================================ */

// Login principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

// Ruta para debug de sesión
app.get("/debug-session", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    user: req.session.user || "No user"
  });
});

/* ===============================
   SERVIDOR
================================ */
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Servidor activo en http://localhost:${PORT}`);
  console.log(` Archivos estáticos en: ${path.join(__dirname, "publico")}`);
});