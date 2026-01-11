const db = require('../../BD/BD');

module.exports = {
    // ================= BUSCAR ================= 
    buscar: (req, res) => {
        console.log('CONTROLADOR BUSCAR: Ejecutado');
        console.log('Parametros:', req.params);
        console.log('URL completa:', req.originalUrl);
        
        const { id } = req.params;
        
        console.log(`Buscando salon ID: ${id}`);
        
        if (!id || isNaN(id)) {
            console.log('ID invalido:', id);
            return res.json({
                success: false,
                message: 'Debe proporcionar un ID de salon valido'
            });
        }
        
        const sql = 'SELECT id, nombre, capacidad, profesor_id FROM salones WHERE id = ?';
        console.log('SQL:', sql, 'ID:', id);
        
        // IMPORTANTE: Verificar que la tabla existe
        db.query('SHOW TABLES LIKE "salones"', (err, tables) => {
            if (err) {
                console.error('Error verificando tablas:', err);
                return res.json({ 
                    success: false, 
                    message: 'Error verificando base de datos' 
                });
            }
            
            console.log('Tabla salones existe?:', tables.length > 0);
            
            if (tables.length === 0) {
                return res.json({
                    success: false,
                    message: 'La tabla "salones" no existe en la base de datos'
                });
            }
            
            // Ahora hacer la consulta real
            db.query(sql, [parseInt(id)], (err, rows) => {
                if (err) {
                    console.error('Error en consulta SQL:', err);
                    console.error('Codigo error:', err.code);
                    console.error('Numero error:', err.errno);
                    console.error('SQL State:', err.sqlState);
                    console.error('SQL Message:', err.sqlMessage);
                    
                    return res.json({ 
                        success: false, 
                        message: 'Error en consulta SQL: ' + (err.sqlMessage || err.message),
                        error_details: {
                            code: err.code,
                            errno: err.errno,
                            sqlState: err.sqlState
                        }
                    });
                }
                
                console.log(`Filas encontradas: ${rows.length}`);
                console.log('Resultados:', JSON.stringify(rows, null, 2));
                
                if (rows.length === 0) {
                    console.log(`No se encontro salon con ID: ${id}`);
                    return res.json({ 
                        success: false, 
                        message: `No se encontro salon con ID: ${id}`,
                        suggestion: 'Intente con ID 1, 2, 3, etc.'
                    });
                }
                
                console.log('Salon encontrado:', rows[0]);
                res.json({ 
                    success: true, 
                    salon: rows[0]
                });
            });
        });
    },

    // ================= REGISTRAR =================
    registrar: (req, res) => {
        const { nombre, capacidad, profesor_id } = req.body;

        if (!nombre || !capacidad || !profesor_id) {
            return res.json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const sql = 'INSERT INTO salones (nombre, capacidad, profesor_id) VALUES (?, ?, ?)';
        db.query(sql, [nombre, capacidad, profesor_id], (err, result) => {
            if (err) {
                console.error('Error registrar:', err);
                return res.json({ success: false, message: 'Error al registrar el salon' });
            }
            res.json({ success: true, message: 'Salon registrado correctamente', id: result.insertId });
        });
    },

    // ================= ELIMINAR =================
    eliminar: (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.json({ success: false, message: 'Debes proporcionar un ID de salon' });
        }

        const sql = 'DELETE FROM salones WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Error al eliminar el salon' });
            }

            if (result.affectedRows === 0) {
                return res.json({ success: false, message: 'Salon no encontrado' });
            }

            res.json({ success: true, message: 'Salon eliminado correctamente' });
        });
    }
};