const express = require("express");
const router = express.Router();
const pool = require("../BD/BD");

router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.json({ success: false, message: "Datos incompletos" });
  }

  try {
    // ADMIN
    const [admin] = await pool.query(
      "SELECT * FROM administradores WHERE usuario = ? AND contrasena = ?",
      [usuario, password]
    );
    if (admin.length) {
      return res.json({ success: true, rol: "admin" });
    }

    // ALUMNO
    const [alumno] = await pool.query(
      "SELECT * FROM alumnos WHERE nombre = ? AND numero_de_control = ?",
      [usuario, password]
    );
    if (alumno.length) {
      return res.json({ success: true, rol: "alumno" });
    }

    // PROFESOR
    const [profesor] = await pool.query(
      "SELECT * FROM profesores WHERE nombre = ? AND numero_de_control = ?",
      [usuario, password]
    );
    if (profesor.length) {
      return res.json({ success: true, rol: "profesor" });
    }

    res.json({ success: false, message: "Credenciales incorrectas" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
