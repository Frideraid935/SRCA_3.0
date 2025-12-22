const express = require("express");
const router = express.Router();
const pool = require("../BD/BD");

router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.json({ success: false, message: "Datos incompletos" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 'admin' AS rol, usuario AS usuario, contrasena AS password
       FROM administradores
       WHERE usuario = ? AND contrasena = ?
       UNION
       SELECT 'profesor' AS rol, nombre AS usuario, numero_de_control AS password
       FROM profesores
       WHERE nombre = ? AND numero_de_control = ?
       UNION
       SELECT 'alumno' AS rol, nombre AS usuario, numero_de_control AS password
       FROM alumnos
       WHERE nombre = ? AND numero_de_control = ?`,
      [usuario, password, usuario, password, usuario, password]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: "Credenciales incorrectas" });
    }

    const usuarioEncontrado = rows[0];
    return res.json({ success: true, rol: usuarioEncontrado.rol, usuario: usuarioEncontrado.usuario });

  } catch (error) {
    console.error("Error en login:", error.message);
    return res.json({ success: false, message: "Error del servidor" });
  }
});

module.exports = router;
