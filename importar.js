const fs = require("fs");
const mysql = require("mysql2/promise");

async function importar() {
  try {
    console.log("🔌 Conectando a MySQL...");

    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST, // mysql.railway.internal
      user: process.env.MYSQLUSER, // root
      password:
        process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE, // railway
      port: process.env.MYSQLPORT || 3306,
      multipleStatements: true
    });

    console.log("📄 Leyendo archivo SQL...");
    const sql = fs.readFileSync("Srca_Data_Base.sql", "utf8");

    console.log("⚙️ Ejecutando consultas...");
    await connection.query(sql);

    await connection.end();

    console.log("✅ BASE DE DATOS IMPORTADA CORRECTAMENTE");
    process.exit(0);
  } catch (error) {
    console.error("❌ ERROR AL IMPORTAR LA BD");
    console.error(error);
    process.exit(1);
  }
}

importar();
