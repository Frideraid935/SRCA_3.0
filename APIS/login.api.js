// APIS/login.api.js
const express = require("express");
const router = express.Router();
const pool = require("../BD/BD");

// Login 
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  console.log("Intento de login:", { usuario, password });

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
      console.log("Login exitoso como ADMIN:", userData);
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
        console.log("Login exitoso como ALUMNO:", userData);
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
        console.log("Login exitoso como PROFESOR:", userData);
      }
    }

    if (userData && rol) {
      // GUARDAR EN SESIÓN
      req.session.user = {
        id: userData.id || userData.numero_de_control || 'N/A',
        username: usuario,
        nombre: userData.nombre || usuario,
        rol: rol,
        email: userData.email || '',
        loginTime: new Date().toISOString()
      };
      
      console.log("Sesión creada:", req.session.user);
      
      return res.json({ 
        success: true, 
        rol: rol,
        user: req.session.user,
        message: `Bienvenido ${userData.nombre || usuario}`
      });
    }

    res.json({ 
      success: false, 
      message: "Credenciales incorrectas" 
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});

// Endpoint para verificar sesión (NUEVO)
router.get("/check", (req, res) => {
  console.log("Verificando sesión - Usuario en sesión:", req.session.user || "No hay usuario");
  
  if (req.session && req.session.user) {
    res.json({ 
      success: true,
      loggedIn: true, 
      user: req.session.user 
    });
  } else {
    res.json({ 
      success: true,
      loggedIn: false,
      message: "No hay sesión activa" 
    });
  }
});

// Endpoint para cerrar sesión (NUEVO)
router.get("/logout", (req, res) => {
  console.log("Cerrando sesión para:", req.session.user?.username || "Usuario desconocido");
  
  const username = req.session.user?.username || 'Usuario';
  
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al destruir sesión:", err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al cerrar sesión' 
      });
    }
    
    res.json({ 
      success: true, 
      message: `Sesión de ${username} cerrada exitosamente` 
    });
  });
});

// Endpoint para información de sesión (debug)
router.get("/session-info", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    user: req.session.user || null,
    cookie: req.session.cookie
  });
});

module.exports = router;