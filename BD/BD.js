// BD.js - Traducción EXACTA de tu código PHP
const mysql = require("mysql2/promise");

// ===== CONFIGURACIÓN DE RAILWAY ===== 
const host = process.env.MYSQLHOST;
const user = process.env.MYSQLUSER;
const password = process.env.MYSQLPASSWORD;
const dbname = process.env.MYSQL_DATABASE;
const port = process.env.MYSQLPORT || 3306;

// ===== DEPURACIÓN OPCIONAL =====
console.log("=== DEBUG CONFIGURACIÓN RAILWAY ===");
console.log("MYSQLHOST:", host || "NO DEFINIDO");
console.log("MYSQLUSER:", user || "NO DEFINIDO");
console.log("MYSQL_DATABASE:", dbname || "NO DEFINIDO");
console.log("MYSQLPORT:", port);

// ===== VALIDAR VARIABLES =====
if (!host || !user || !password || !dbname) {
  console.error("\n🚨 ERROR: Faltan variables de entorno de Railway.");
  console.error("Asegúrate de haber configurado en Railway SRCA3.0 → Variables:");
  console.error("MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQL_DATABASE, MYSQLPORT");
  
  // Valores de EMERGENCIA (del screenshot)
  console.error("\n⚠️  Usando valores de emergencia del screenshot...");
  
  const emergencyConfig = {
    host: "mysql.railway.internal",
    port: 3306,
    user: "root",
    password: "LDjVxOHEvKrtQqmyMGmmnvVbZeYXdABF",
    database: "railway"
  };
  
  const pool = mysql.createPool({
    ...emergencyConfig,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    ssl: { rejectUnauthorized: false }
  });
  
  console.log("✅ Pool creado con valores de emergencia");
  module.exports = pool;
  return;
}

// ===== CONEXIÓN =====
console.log("\n🔗 Conectando a MySQL Railway...");
console.log(`Host: ${host}:${port}`);
console.log(`Usuario: ${user}`);
console.log(`Base de datos: ${dbname}`);

const pool = mysql.createPool({
  host: host,
  port: port,
  user: user,
  password: password,
  database: dbname,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

// Probar conexión
pool.getConnection()
  .then(connection => {
    console.log("✅ Conexión a Railway exitosa!");
    connection.release();
  })
  .catch(error => {
    console.error("❌ Error de conexión a Railway:", error.message);
    console.error("Código:", error.code);
    
    // Si es error de acceso, probablemente las variables no tienen valores reales
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("\n💡 SOLUCIÓN:");
      console.error("1. Ve a Railway → SRCA3.0 → Variables");
      console.error("2. Cambia cada variable {{MySQL.XXX}} por el valor REAL");
      console.error("3. Los valores REALES están en MySQL → Variables");
    }
  });

module.exports = pool;