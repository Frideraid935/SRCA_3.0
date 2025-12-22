const mysql = require("mysql2/promise");

const mysqlUrl = process.env.MYSQL_URL;

if (!mysqlUrl) {
  console.error(" ERROR: MYSQL_URL no está definida");
  console.log("Variables disponibles:", Object.keys(process.env).filter(k => k.includes('MYSQL')));
  process.exit(1);
}

console.log("MYSQL_URL encontrada, parseando...");

// Parsear la URL de MySQL (formato: mysql://user:pass@host:port/db)
const parseMySQLUrl = (urlString) => {
  try {
    // Eliminar el protocolo mysql://
    const withoutProtocol = urlString.replace('mysql://', '');
    
    // Separar usuario:contraseña@host:puerto/base_de_datos
    const atSplit = withoutProtocol.split('@');
    const userPass = atSplit[0];
    const hostPortDb = atSplit[1];
    
    const [user, password] = userPass.split(':');
    const [hostPort, database] = hostPortDb.split('/');
    const [host, port] = hostPort.split(':');
    
    return {
      host: host,
      port: port || 3306,
      user: user,
      password: password,
      database: database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false // Necesario para Railway
      }
    };
  } catch (error) {
    console.error(" Error parseando MYSQL_URL:", error);
    return null;
  }
};

const config = parseMySQLUrl(mysqlUrl);

if (!config) {
  console.error(" No se pudo parsear MYSQL_URL, usando configuración alternativa...");
  
  // Intentar con variables individuales
  const altConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    port: process.env.MYSQLPORT || 3306,
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'test',
    waitForConnections: true,
    connectionLimit: 10
  };
  
  console.log("Usando configuración alternativa:", {
    host: altConfig.host,
    database: altConfig.database,
    user: altConfig.user
  });
  
  var pool = mysql.createPool(altConfig);
} else {
  console.log("Configuración parseada correctamente:");
  console.log("   Host:", config.host);
  console.log("   DB:", config.database);
  console.log("   User:", config.user);
  
  var pool = mysql.createPool(config);
}

// Probar la conexión
pool.getConnection()
  .then(connection => {
    console.log(" Conexión a MySQL exitosa!");
    connection.release();
  })
  .catch(err => {
    console.error(" Error conectando a MySQL:", err.message);
  });

module.exports = pool;