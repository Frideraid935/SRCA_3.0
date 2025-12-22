// BD.js - Versión equivalente al PHP exitoso
const mysql = require("mysql2/promise");

// Usa las MISMAS variables que usaba PHP
const config = {
  host: process.env.MYSQLHOST || "mysql.railway.internal",
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE || "railway",
  
  // Configuración equivalente a PDO en PHP
  charset: 'utf8mb4',  // ¡IMPORTANTE! Igual que PHP
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // SSL - Railway requiere esto
  ssl: {
    rejectUnauthorized: false  // Permitir certificados self-signed
  }
};

console.log("=== CONFIGURACIÓN MYSQL (igual que PHP) ===");
console.log("Host:", config.host);
console.log("Puerto:", config.port);
console.log("Usuario:", config.user);
console.log("Base de datos:", config.database);
console.log("Charset:", config.charset);
console.log("SSL:", config.ssl ? "Activado" : "Desactivado");

const pool = mysql.createPool(config);

// Probar conexión EXACTAMENTE como lo haría PHP
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    
    // Hacer una consulta de prueba como haría PHP
    const [rows] = await connection.query('SELECT 1 as test, NOW() as hora, DATABASE() as db');
    
    console.log("\n✅ ¡CONEXIÓN EXITOSA! (igual que PHP)");
    console.log("   Test:", rows[0].test);
    console.log("   Hora servidor:", rows[0].hora);
    console.log("   Base de datos:", rows[0].db);
    
    // Verificar tablas que buscaba PHP
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'administradores' OR SHOW TABLES LIKE 'alumnos' OR SHOW TABLES LIKE 'profesores'"
    );
    
    console.log("   Tablas encontradas:", tables.length);
    
    connection.release();
    return true;
  } catch (error) {
    console.error("\n❌ ERROR DE CONEXIÓN:", error.code);
    console.log("   Mensaje:", error.message);
    console.log("\n💡 DEBUG - Variables de entorno disponibles:");
    
    // Mostrar TODAS las variables MYSQL
    const mysqlVars = {};
    for (const key in process.env) {
      if (key.includes('MYSQL')) {
        mysqlVars[key] = process.env[key] ? "DEFINIDA" : "NO DEFINIDA";
      }
    }
    console.log(mysqlVars);
    
    return false;
  }
}

// Probar conexión
testConnection();

module.exports = pool;