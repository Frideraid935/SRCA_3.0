const db = require('../BD/db');

const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos'
    });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE usuario = ? AND password = ?',
      [usuario, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    res.json({
      success: true,
      message: 'Login correcto',
      usuario: rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

module.exports = { login };
