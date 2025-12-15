const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "publico")));

// RUTA PRINCIPAL → LOGIN
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

// API Login
const loginApi = require("./APIS/login.api");
app.use("/api/login", loginApi);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
