const pool = require("../BD/BD.js");

async function login(req, res) {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      success: false,
      message: "Datos incompletos"
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, rol FROM usuarios WHERE usuario = ? AND password = ?",
      [usuario, password]
    );

    if (rows.length === 0) {
      return res.json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    return res.json({
      success: true,
      rol: rows[0].rol
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
}

module.exports = { login };
