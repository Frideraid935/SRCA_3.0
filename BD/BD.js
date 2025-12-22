// BD.js - VERSIÓN CORREGIDA DEFINITIVA
const mysql = require("mysql2/promise");

// ¡VERIFICA QUE ESTOS VALORES SEAN EXACTAMENTE IGUALES a MySQL → Variables!
const MYSQL_CONFIG = {
  // OPCIÓN 1: Conexión INTERNA (recomendada entre servicios Railway)
  host: "mysql.railway.internal",
  port: 3306,
  user: "root",
  password: "LDjVxOHEvKrtQqmyMGmmnvVbZeYXdABF", // ← ¡VERIFICA QUE SEA EXACTA!
  database: "railway",
  
  // OPCIÓN 2: Conexión PÚBLICA (alternativa)
  // host: "shuttle.proxy.rlwy.net",
  // port: 51060,
  // user: "root",
  // password: "LDjVxOHEvKrtQqmyMGmmnvVbZeYXdABF",
  // database: "railway",
  
  // Configuración común
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false  // ¡OBLIGATORIO para Railway!
  }
};

console.log("=== CONFIGURACIÓN MYSQL ===");
console.log("Host:", MYSQL_CONFIG.host);
console.log("Puerto:", MYSQL_CONFIG.port);
console.log("Usuario:", MYSQL_CONFIG.user);
console.log("Contraseña (primeros 8 chars):", MYSQL_CONFIG.password.substring(0, 8) + "...");
console.log("Base de datos:", MYSQL_CONFIG.database);
console.log("SSL:", MYSQL_CONFIG.ssl ? "Activado" : "Desactivado");

const pool = mysql.createPool(MYSQL_CONFIG);

// Función de prueba de conexión MEJORADA
async function testDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 1. Verificar usuario y conexión
    const [userInfo] = await connection.query('SELECT USER() as user, DATABASE() as db');
    console.log("\n✅ ¡CONEXIÓN MYSQL EXITOSA!");
    console.log("   Usuario conectado:", userInfo[0].user);
    console.log("   Base de datos:", userInfo[0].db);
    
    // 2. Verificar que existen las tablas necesarias
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN ('administradores', 'alumnos', 'profesores', 'usuarios')
      ORDER BY TABLE_NAME
    `);
    
    if (tables.length > 0) {
      console.log("   Tablas encontradas:", tables.map(t => t.TABLE_NAME).join(', '));
    } else {
      console.warn("   ⚠️  No se encontraron las tablas de usuarios");
      console.warn("   Crea las tablas con los comandos SQL apropiados");
    }
    
    // 3. Verificar contenido de la tabla 'usuarios' (si existe)
    if (tables.some(t => t.TABLE_NAME === 'usuarios')) {
      const [users] = await connection.query('SELECT COUNT(*) as count FROM usuarios');
      console.log("   Total usuarios en BD:", users[0].count);
    }
    
    connection.release();
    return true;
    
  } catch (error) {
    console.error("\n❌ ERROR DE CONEXIÓN MYSQL:");
    console.error("   Código:", error.code);
    console.error("   Mensaje:", error.message);
    console.error("   Número error:", error.errno);
    
    if (connection) {
      connection.release();
    }
    
    // Análisis del error
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("\n🔍 DIAGNÓSTICO: Error de autenticación");
      console.error("   Usuario:", MYSQL_CONFIG.user);
      console.error("   Contraseña usada:", MYSQL_CONFIG.password.substring(0, 10) + "...");
      console.error("\n💡 SOLUCIÓN:");
      console.error("   1. Ve a Railway → MySQL → Variables");
      console.error("   2. Copia el valor EXACTO de MYSQLPASSWORD");
      console.error("   3. Pégala aquí en BD.js");
      console.error("   4. Asegúrate que no haya espacios al inicio/final");
    }
    
    return false;
  }
}

// Probar conexión después de 1 segundo
setTimeout(() => {
  console.log("\n🔍 Probando conexión a MySQL...");
  testDatabaseConnection();
}, 1000);

module.exports = pool;