// login.controlador.js - VERSIÓN MEJORADA
const pool = require('../BD/BD');

async function login(req, res) {
  console.log("\n=== SOLICITUD DE LOGIN ===");
  console.log("Usuario:", req.body.usuario);
  console.log("Contraseña recibida:", req.body.contraseña ? "SÍ" : "NO");
  
  const { usuario, contraseña } = req.body;
  
  if (!usuario || !contraseña) {
    console.log(" Datos incompletos");
    return res.status(400).json({
      error: true,
      mensaje: 'Usuario y contraseña son requeridos'
    });
  }
  
  try {
    // PRUEBA: Verificar que el pool funciona
    console.log(" Verificando conexión a BD...");
    const testConn = await pool.getConnection();
    
    // 1. Buscar en administradores (PRIMERO, como en PHP)
    console.log("   Buscando en administradores...");
    const [admins] = await pool.query(
      'SELECT * FROM administradores WHERE usuario = ?',
      [usuario]
    );
    
    if (admins.length > 0) {
      const admin = admins[0];
      console.log(`    Admin encontrado: ${admin.usuario}`);
      
      // Comparar contraseñas (las contraseñas están en texto plano en tu PHP)
      if (contraseña === admin.contrasena) {
        console.log("    Contraseña admin correcta");
        testConn.release();
        
        return res.json({
          error: false,
          mensaje: 'Login administrador exitoso',
          tipo_usuario: 'administrador',
          usuario: admin.usuario
        });
      } else {
        console.log("    Contraseña admin incorrecta");
      }
    }
    
    // 2. Buscar en alumnos
    console.log("   Buscando en alumnos...");
    const [alumnos] = await pool.query(
      'SELECT * FROM alumnos WHERE nombre = ? AND numero_de_control = ?',
      [usuario, contraseña]
    );
    
    if (alumnos.length > 0) {
      const alumno = alumnos[0];
      console.log(`    Alumno encontrado: ${alumno.nombre}`);
      testConn.release();
      
      return res.json({
        error: false,
        mensaje: 'Login alumno exitoso',
        tipo_usuario: 'alumno',
        numero_control: alumno.numero_de_control,
        nombre: alumno.nombre
      });
    }
    
    // 3. Buscar en profesores
    console.log("   Buscando en profesores...");
    const [profesores] = await pool.query(
      'SELECT * FROM profesores WHERE nombre = ? AND numero_de_control = ?',
      [usuario, contraseña]
    );
    
    if (profesores.length > 0) {
      const profesor = profesores[0];
      console.log(`    Profesor encontrado: ${profesor.nombre}`);
      testConn.release();
      
      return res.json({
        error: false,
        mensaje: 'Login profesor exitoso',
        tipo_usuario: 'profesor',
        numero_control: profesor.numero_de_control,
        nombre: profesor.nombre
      });
    }
    
    // 4. Buscar en tabla general 'usuarios' (si existe)
    console.log("   Buscando en tabla usuarios...");
    try {
      const [usuarios] = await pool.query(
        'SELECT * FROM usuarios WHERE usuario = ? AND clave = ?',
        [usuario, contraseña]
      );
      
      if (usuarios.length > 0) {
        const user = usuarios[0];
        console.log(`    Usuario encontrado: ${user.usuario}`);
        testConn.release();
        
        return res.json({
          error: false,
          mensaje: 'Login exitoso',
          tipo_usuario: user.tipo || 'usuario',
          usuario: user.usuario
        });
      }
    } catch (tableError) {
      console.log("     Tabla 'usuarios' no existe o tiene error:", tableError.message);
    }
    
    // 5. Ningún usuario encontrado
    console.log("   Credenciales incorrectas para todos los tipos");
    testConn.release();
    
    return res.status(401).json({
      error: true,
      mensaje: 'Usuario o contraseña incorrectos'
    });
    
  } catch (error) {
    console.error(" ERROR EN LOGIN:", error.code || error.name);
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    
    return res.status(500).json({
      error: true,
      mensaje: 'Error en el servidor',
      detalle: error.message,
      codigo: error.code
    });
  }
}

module.exports = { login };