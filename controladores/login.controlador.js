// login.controlador.js - VERSIÓN CORREGIDA
const pool = require('../BD/BD'); // Asegúrate que esta ruta es correcta

async function login(req, res) {
  const { usuario, clave } = req.body;
  
  console.log("Intento de login para usuario:", usuario);
  
  try {
    // VERIFICAR que pool sea válido
    if (!pool || typeof pool.query !== 'function') {
      console.error("ERROR: pool no está inicializado correctamente");
      return res.status(500).json({ 
        error: true, 
        mensaje: 'Error de conexión a la base de datos' 
      });
    }
    
    // Consulta corregida
    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = ? AND clave = ?',
      [usuario, clave]
    );
    
    if (usuarios.length > 0) {
      console.log("Login exitoso para:", usuario);
      res.json({ 
        error: false, 
        mensaje: 'Login exitoso',
        usuario: usuarios[0]
      });
    } else {
      console.log("Credenciales incorrectas para:", usuario);
      res.status(401).json({ 
        error: true, 
        mensaje: 'Usuario o contraseña incorrectos' 
      });
    }
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ 
      error: true, 
      mensaje: 'Error interno del servidor',
      detalle: error.message 
    });
  }
}

module.exports = { login };