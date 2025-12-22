// BD.js - Con la contraseña EXACTA
const mysql = require("mysql2/promise");

// ¡USA LA CONTRASEÑA CORRECTA! Del screenshot:
// MYSQL_ROOT_PASSWORD: LDjVx0HEvkrtQqmyMGmmvvbZaYXdABF (con Z)
// MYSQLPASSWORD: LDjVx0HEvkrtQqmyMGmmvvbZeYXdABF (con e)

const PASSWORD = "LDjVx0HEvkrtQqmyMGmmvvbZaYXdABF"; // ← CON Z (de MYSQL_ROOT_PASSWORD)

console.log("🔑 Usando contraseña de MYSQL_ROOT_PASSWORD");

const connectionOptions = [
  // PRIMERO probar con MYSQL_ROOT_PASSWORD (más probable)
  {
    name: "CONEXIÓN ROOT PÚBLICA",
    config: {
      host: "shuttle.proxy.rlwy.net",
      port: 51060,
      user: "root",
      password: PASSWORD, // ← CON Z
      database: "railway",
      waitForConnections: true,
      connectionLimit: 10,
      ssl: { rejectUnauthorized: false }
    }
  },
  // LUEGO probar con MYSQLPASSWORD (alternativa)
  {
    name: "CONEXIÓN PÚBLICA ALTERNATIVA",
    config: {
      host: "shuttle.proxy.rlwy.net",
      port: 51060,
      user: "root",
      password: "LDjVx0HEvkrtQqmyMGmmvvbZeYXdABF", // ← CON e
      database: "railway",
      waitForConnections: true,
      connectionLimit: 10,
      ssl: { rejectUnauthorized: false }
    }
  },
  // Conexión interna
  {
    name: "CONEXIÓN INTERNA ROOT",
    config: {
      host: "mysql.railway.internal",
      port: 3306,
      user: "root",
      password: PASSWORD, // ← CON Z
      database: "railway",
      waitForConnections: true,
      connectionLimit: 10,
      ssl: { rejectUnauthorized: false }
    }
  }
];

async function createConnection() {
  console.log("🔍 Probando diferentes combinaciones...");
  
  for (const option of connectionOptions) {
    try {
      console.log(`\n🔄 Probando: ${option.name}`);
      console.log(`   Contraseña: ${option.config.password.substring(0, 10)}...`);
      
      const pool = mysql.createPool(option.config);
      const conn = await pool.getConnection();
      
      console.log(`✅ ${option.name} - ¡ÉXITO!`);
      
      // Hacer una consulta simple para verificar
      const [rows] = await conn.query('SELECT 1 + 1 AS result');
      console.log(`   Test query: ${rows[0].result}`);
      
      conn.release();
      return pool;
    } catch (err) {
      console.log(`❌ ${option.name} falló: ${err.code}`);
      if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log(`   Error: Usuario/contraseña incorrectos para ${option.config.user}`);
      }
    }
  }
  
  // Si todo falla, intentar SIN contraseña (solo para testing)
  console.log("\n⚠️  Probando sin contraseña...");
  try {
    const testPool = mysql.createPool({
      host: "shuttle.proxy.rlwy.net",
      port: 51060,
      user: "root",
      password: "", // Sin contraseña
      database: "railway",
      waitForConnections: true,
      connectionLimit: 10,
      ssl: { rejectUnauthorized: false }
    });
    
    const conn = await testPool.getConnection();
    console.log("✅ ¡Conexión sin contraseña funciona!");
    conn.release();
    return testPool;
  } catch (err) {
    console.log("❌ También falló sin contraseña:", err.code);
  }
  
  throw new Error("No se pudo conectar a MySQL");
}

// Crear conexión SIN bloquear el inicio del servidor
let poolPromise = createConnection()
  .then(pool => {
    console.log("\n🎉 ¡CONEXIÓN A MYSQL ESTABLECIDA!");
    return pool;
  })
  .catch(err => {
    console.error("\n💥 ERROR:", err.message);
    console.log("\n📋 DEBUG - Valores del screenshot:");
    console.log("MYSQL_ROOT_PASSWORD: LDjVx0HEvkrtQqmyMGmmvvbZaYXdABF");
    console.log("MYSQLPASSWORD: LDjVx0HEvkrtQqmyMGmmvvbZeYXdABF");
    console.log("\n💡 Intenta usar esta URL COMPLETA:");
    console.log("mysql://root:LDjVx0HEvkrtQqmyMGmmvvbZaYXdABF@shuttle.proxy.rlwy.net:51060/railway");
    
    // Pool dummy para desarrollo
    return mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'test',
      waitForConnections: true,
      connectionLimit: 5
    });
  });

// Exportar
module.exports = poolPromise;