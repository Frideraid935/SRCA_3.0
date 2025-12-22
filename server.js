const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "publico")));

// Rutas API
const loginApi = require("./APIS/login.api");
app.use("/api", loginApi);

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

// Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
