// APIS/login.api.js
const express = require("express");
const router = express.Router();
const pool = require("../BD/BD");

// Login endpoint
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.json({ success: false, message: "Datos incompletos" });
  }

  try {
    let userData = null;
    let rol = "";

    // ADMIN
    const [admin] = await pool.query(
      "SELECT * FROM administradores WHERE usuario = ? AND contrasena = ?",
      [usuario, password]
    );
    if (admin.length) {
      userData = admin[0];
      rol = "admin";
    }

    // ALUMNO
    if (!userData) {
      const [alumno] = await pool.query(
        "SELECT * FROM alumnos WHERE nombre = ? AND numero_de_control = ?",
        [usuario, password]
      );
      if (alumno.length) {
        userData = alumno[0];
        rol = "alumno";
      }
    }

    // PROFESOR
    if (!userData) {
      const [profesor] = await pool.query(
        "SELECT * FROM profesores WHERE nombre = ? AND numero_de_control = ?",
        [usuario, password]
      );
      if (profesor.length) {
        userData = profesor[0];
        rol = "profesor";
      }
    }

    if (userData && rol) {
      // Guardar en sesión
      req.session.user = {
        id: userData.id || userData.numero_de_control,
        username: usuario,
        nombre: userData.nombre || usuario,
        rol: rol,
        timestamp: new Date()
      };
      
      console.log('Login exitoso:', req.session.user);
      
      return res.json({ 
        success: true, 
        rol: rol,
        user: req.session.user
      });
    }

    res.json({ success: false, message: "Credenciales incorrectas" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// Endpoint para verificar sesión (ESTO ES LO QUE FALTA)
router.get("/check", (req, res) => {
  console.log('Solicitando check de sesión');
  
  if (req.session && req.session.user) {
    res.json({ 
      loggedIn: true, 
      user: req.session.user 
    });
  } else {
    res.json({ 
      loggedIn: false 
    });
  }
});

// Endpoint para cerrar sesión
router.get("/logout", (req, res) => {
  console.log('Cerrando sesión');
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir sesión:', err);
      return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }
    
    res.json({ 
      success: true, 
      message: 'Sesión cerrada exitosamente' 
    });
  });
});

module.exports = router;