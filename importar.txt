const fs = require("fs");
const mysql = require("mysql2/promise");

async function importar() {
  try {
    console.log("🔌 Conectando a MySQL...");

    // Conexión usando variables de entorno de Railway
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,      // mysql.railway.internal
      user: process.env.MYSQLUSER,      // root
      password: process.env.MYSQLPASSWORD, 
      database: process.env.MYSQLDATABASE, // railway
      port: process.env.MYSQLPORT,      // 3306
      multipleStatements: true          // Permite ejecutar varias consultas
    });

    console.log("📄 Leyendo archivo SQL...");
    const sql = fs.readFileSync("Srca_Data_Base.sql", "utf8");

    console.log("⚙️ Ejecutando consultas...");
    await connection.query(sql);

    await connection.end();
    console.log("✅ BASE DE DATOS IMPORTADA CORRECTAMENTE");
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR AL IMPORTAR LA BD");
    console.error(err.message);
    process.exit(1);
  }
}

importar();
