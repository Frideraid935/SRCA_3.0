const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "publico")));

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

// IMPORTANTE: NO cargues APIs todavía
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
