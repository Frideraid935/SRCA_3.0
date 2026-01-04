const express = require("express");
const path = require("path");
const { pool, testDatabaseConnection } = require("./BD/BD");

const app = express();
const PORT = process.env.PORT || 3000;

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

// Materias
const materiasAPI = require('./APIS/materias.api.js');
app.use('/api/materias', materiasAPI);

// Admin
const adminApi = require("./APIS/admin.api");
app.use("/api/admin", adminApi);

// Calificaciones
const calificacionesAPI = require('./APIS/calificaciones.api');
app.use('/api/calificaciones', calificacionesAPI);

/* ===============================
   RUTAS DE VISTAS
================================ */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

/* ===============================
   LEVANTAR SERVIDOR SOLO SI DB FUNCIONA
================================ */
async function startServer() {
  const dbOk = await testDatabaseConnection();
  if (!dbOk) {
    console.error(" No se puede iniciar el servidor: falla la conexión a MySQL");
    process.exit(1); // Salir si DB falla
  }

  app.listen(PORT, () => {
    console.log(` Servidor activo en puerto ${PORT}`);
  });
}

// Iniciar servidor
startServer();
