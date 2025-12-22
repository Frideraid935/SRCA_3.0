const fs = require("fs");
const mysql = require("mysql2/promise");

async function importar() {
  try {
    console.log("🔌 Conectando a MySQL...");

    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
      multipleStatements: true
    });

    const sql = fs.readFileSync("Srca_Data_Base.sql", "utf8");
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
