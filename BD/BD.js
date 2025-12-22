// BD.js - Con la contraseña ACTUAL del nuevo screenshot
const mysql = require("mysql2/promise");

// ¡CONTRASEÑA ACTUAL del screenshot NUEVO!
const CURRENT_PASSWORD = "LDjVxOHEvKrtQqmyMGmmnvVbZeYXdABF";

console.log("=== MYSQL CONFIGURACIÓN ===");
console.log("Usando contraseña del screenshot más reciente");
console.log("Contraseña (primeros 10 chars):", CURRENT_PASSWORD.substring(0, 10) + "...");

// Configuración PRINCIPAL - Usa MYSQL_PUBLIC_URL del screenshot
const config = {
  host: "shuttle.proxy.rlwy.net",    // De MYSQL_PUBLIC_URL
  port: 51060,                        // De MYSQL_PUBLIC_URL  
  user: "root",                       // De MYSQLUSER
  password: CURRENT_PASSWORD,         // De MYSQL_PUBLIC_URL/MYSQLPASSWORD
  database: "railway",                // De MYSQL_DATABASE
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false  // CRÍTICO para Railway
  }
};

console.log("\n📡 Configuración de conexión:");
console.log("   Host:", config.host);
console.log("   Puerto:", config.port);
console.log("   Usuario:", config.user);
console.log("   Base de datos:", config.database);

// Crear el pool
const pool = mysql.createPool(config);

// Función para probar conexión (sin bloquear el inicio)
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("\n✅ ¡CONEXIÓN A MYSQL EXITOSA!");
    
    // Hacer una consulta simple
    const [rows] = await connection.query('SELECT NOW() as hora_actual, DATABASE() as base_datos');
    console.log("   Hora servidor:", rows[0].hora_actual);
    console.log("   Base de datos:", rows[0].base_datos);
    
    connection.release();
    return true;
  } catch (error) {
    console.error("\n❌ ERROR DE CONEXIÓN:", error.code);
    console.log("   Mensaje:", error.message);
    
    // Dar consejos específicos
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("\n💡 PROBLEMA DE AUTENTICACIÓN:");
      console.log("   La contraseña actual es:", CURRENT_PASSWORD);
      console.log("   Verifica en Railway MySQL → Variables que sea EXACTA");
    } else if (error.code === 'ECONNREFUSED') {
      console.log("\n💡 CONEXIÓN RECHAZADA:");
      console.log("   El servicio MySQL puede no estar ejecutándose");
      console.log("   Verifica en Railway que MySQL esté 'Online'");
    }
    
    return false;
  }
}

// Probar conexión después de 2 segundos
setTimeout(() => {
  testConnection().then(success => {
    if (!success) {
      console.log("\n⚠️  La aplicación inició SIN conexión a MySQL");
      console.log("   Las funciones de BD no estarán disponibles");
    }
  });
}, 2000);

// Exportar el pool CORRECTAMENTE
module.exports = pool;