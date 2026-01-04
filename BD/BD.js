const mysql = require("mysql2/promise");

// Crear pool de conexiones usando variables de entorno
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false } // Necesario para Railway
});

// Función para probar la conexión a la base de datos
async function testDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [userInfo] = await connection.query('SELECT USER() as user, DATABASE() as db');
    console.log(" CONEXIÓN MYSQL EXITOSA:", userInfo[0]);

    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);
    console.log("Tablas encontradas:", tables.map(t => t.TABLE_NAME).join(', '));

    connection.release();
    return true;
  } catch (error) {
    if (connection) connection.release();
    console.error(" ERROR DE CONEXIÓN MYSQL:", error.message);
    return false;
  }
}

// Exportar pool y función de test
module.exports = { pool, testDatabaseConnection };
