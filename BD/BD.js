const mysql = require("mysql2/promise");

// Usa ESTOS VALORES EXACTOS que copiaste
const config = {
  host: "mysql.railway.internal",  // De MYSQLHOST
  port: 3306,                      // De MYSQLPORT
  user: "root",                    // De MYSQLUSER
  password: "LDjVx0HEvkrtQqmyMGmmvvbZeYXdABF",  // De MYSQLPASSWORD
  database: "railway",             // De MYSQL_DATABASE
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {                           // ¡IMPORTANTE para Railway!
    rejectUnauthorized: false
  }
};

console.log("=== CONFIGURACIÓN MYSQL ===");
console.log("Host:", config.host);
console.log("Database:", config.database);
console.log("User:", config.user);
console.log("Port:", config.port);

const pool = mysql.createPool(config);

// Probar conexión inmediatamente
pool.getConnection()
  .then(connection => {
    console.log("\n ¡CONEXIÓN EXITOSA A MYSQL EN RAILWAY!");
    console.log(`Servidor: ${config.host}:${config.port}`);
    console.log(`Base de datos: ${config.database}`);
    connection.release();
  })
  .catch(err => {
    console.error("\n ERROR DE CONEXIÓN:", err.message);
    console.log("Código de error:", err.code);
    
    // Si falla la conexión interna, probar con la URL pública
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      console.log("\n  Probando con URL pública...");
      
      const publicConfig = {
        host: "shuttle.proxy.rlwy.net",  // De MYSQL_URL pública
        port: 51060,                     // De MYSQL_URL pública
        user: "root",
        password: "LDjVx0HEvkrtQqmyMGmmvvbZeYXdABF",
        database: "railway",
        waitForConnections: true,
        connectionLimit: 10,
        ssl: { rejectUnauthorized: false }
      };
      
      console.log("Probando con host público:", publicConfig.host);
      
      const publicPool = mysql.createPool(publicConfig);
      publicPool.getConnection()
        .then(conn => {
          console.log("¡Conexión exitosa por URL pública!");
          conn.release();
          // Reemplazar el pool con la conexión pública
          module.exports = publicPool;
        })
        .catch(publicErr => {
          console.error(" También falló la URL pública:", publicErr.message);
        });
    }
  });

module.exports = pool;