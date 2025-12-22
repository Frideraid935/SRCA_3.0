// BD.js - Versión inteligente que prueba ambas
const mysql = require("mysql2/promise");

async function createBestConnection() {
  const connectionOptions = [
    {
      name: "CONEXIÓN PÚBLICA",
      config: {
        host: "shuttle.proxy.rlwy.net",
        port: 51060,
        user: "root",
        password: "LDjVx0HEvkrtQqmyMGmmvvbZeYXdABF",
        database: "railway",
        waitForConnections: true,
        connectionLimit: 10,
        ssl: { rejectUnauthorized: false }
      }
    },
    {
      name: "CONEXIÓN INTERNA",
      config: {
        host: "mysql.railway.internal",
        port: 3306,
        user: "root",
        password: "LDjVx0HEvkrtQqmyMGmmvvbZeYXdABF",
        database: "railway",
        waitForConnections: true,
        connectionLimit: 10,
        ssl: { rejectUnauthorized: false }
      }
    }
  ];

  // Probar cada opción
  for (const option of connectionOptions) {
    try {
      console.log(`🔍 Probando ${option.name}...`);
      console.log(`   Host: ${option.config.host}:${option.config.port}`);
      
      const testPool = mysql.createPool(option.config);
      const connection = await testPool.getConnection();
      
      console.log(`✅ ${option.name} EXITOSA!`);
      connection.release();
      
      return {
        pool: testPool,
        config: option.config,
        type: option.name
      };
    } catch (err) {
      console.log(`❌ ${option.name} falló: ${err.code || err.message}`);
    }
  }
  
  throw new Error("Todas las conexiones fallaron");
}

// Crear conexión
const connectionPromise = createBestConnection();

// Iniciar servidor después de conectar
connectionPromise
  .then(({ pool, config, type }) => {
    console.log(`\n🎉 ${type} ESTABLECIDA`);
    console.log(`📊 Servidor: ${config.host}:${config.port}`);
    console.log(`🗄️  Base de datos: ${config.database}`);
    
    // Aquí puedes iniciar tu servidor Express
    const PORT = process.env.PORT || 8080;
    // app.listen(PORT, () => {
    //   console.log(`Servidor activo en puerto ${PORT}`);
    // });
    
    module.exports = pool;
  })
  .catch(err => {
    console.error("\n💥 ERROR CRÍTICO:", err.message);
    console.log("\n📋 Posibles soluciones:");
    console.log("1. Verifica que la contraseña sea correcta");
    console.log("2. Asegúrate de que el servicio MySQL esté 'Online'");
    console.log("3. Espera 2-3 minutos después del deploy");
    
    // Pool dummy para que no falle el require
    const dummyPool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'test',
      waitForConnections: true,
      connectionLimit: 5
    });
    
    module.exports = dummyPool;
  });

// Exportar la promesa, no el pool directamente
module.exports = connectionPromise.then(({ pool }) => pool);