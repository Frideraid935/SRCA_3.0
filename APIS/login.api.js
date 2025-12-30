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
      `SELECT 'admin' AS rol, usuario AS nombre
       FROM administradores
       WHERE usuario = ? AND contrasena = ?

       UNION

       SELECT 'profesor' AS rol, nombre AS nombre
       FROM profesores
       WHERE nombre = ? AND numero_de_control = ?

       UNION

       SELECT 'alumno' AS rol, nombre AS nombre
       FROM alumnos
       WHERE nombre = ? AND numero_de_control = ?`,
      [usuario, password, usuario, password, usuario, password]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: "Credenciales incorrectas" });
    }

    res.json({
      success: true,
      rol: rows[0].rol,
      nombre: rows[0].nombre
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

module.exports = router;
