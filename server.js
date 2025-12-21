const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "publico")));

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "publico/Login/login.html"));
});

// API LOGIN
app.post("/api/login", (req, res) => {
  const { usuario, password } = req.body;

  // PRUEBA BÁSICA (luego conectamos BD)
  if (usuario === "admin" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Credenciales incorrectas" });
  }
});

// Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
