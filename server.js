const express = require("express");
const path = require("path");
const pool = require("./BD/BD");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "publico")));

/* ===============================
   RUTAS API
================================ */

//  Login
const loginApi = require("./APIS/login.api");
app.use("/api", loginApi);

//  Alumnos (CRUD + listar)
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
  console.log(`Servidor activo en puerto ${PORT}`);
});
