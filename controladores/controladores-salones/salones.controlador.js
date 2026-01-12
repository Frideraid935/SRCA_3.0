// salones.controlador.js (versión completa)
const pool = require('../../BD/BD');

module.exports = {
    // ================= BUSCAR (convertida a async/await) ================= 
    buscar: async (req, res) => {
        console.log('CONTROLADOR BUSCAR: Ejecutado');
        console.log('Parametros:', req.params);
        
        try {
            const { id } = req.params;
            
            console.log(`Buscando salon ID: ${id}`);
            
            if (!id || isNaN(id)) {
                console.log('ID invalido:', id);
                return res.json({
                    success: false,
                    message: 'Debe proporcionar un ID de salon valido'
                });
            }
            
            // Verificar que la tabla existe
            const [tables] = await pool.query('SHOW TABLES LIKE "salones"');
            console.log('Tabla salones existe?:', tables.length > 0);
            
            if (tables.length === 0) {
                return res.json({
                    success: false,
                    message: 'La tabla "salones" no existe en la base de datos'
                });
            }
            
            // Hacer la consulta real
            const [rows] = await pool.query(
                'SELECT id, nombre, capacidad, profesor_id FROM salones WHERE id = ?',
                [parseInt(id)]
            );
            
            console.log(`Filas encontradas: ${rows.length}`);
            
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
            
        } catch (error) {
            console.error('Error en buscar salon:', error);
            console.error('Codigo error:', error.code);
            console.error('Numero error:', error.errno);
            
            return res.json({ 
                success: false, 
                message: 'Error en consulta SQL: ' + error.message,
                error_details: {
                    code: error.code,
                    errno: error.errno
                }
            });
        }
    },

    // ================= REGISTRAR (mantener igual) =================
    registrar: (req, res) => {
        const { nombre, capacidad, profesor_id } = req.body;

        if (!nombre || !capacidad || !profesor_id) {
            return res.json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const sql = 'INSERT INTO salones (nombre, capacidad, profesor_id) VALUES (?, ?, ?)';
        pool.query(sql, [nombre, capacidad, profesor_id], (err, result) => {
            if (err) {
                console.error('Error registrar:', err);
                return res.json({ success: false, message: 'Error al registrar el salon' });
            }
            res.json({ success: true, message: 'Salon registrado correctamente', id: result.insertId });
        });
    },

    // ================= ELIMINAR (mantener igual) =================
    eliminar: (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.json({ success: false, message: 'Debes proporcionar un ID de salon' });
        }

        const sql = 'DELETE FROM salones WHERE id = ?';
        pool.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Error al eliminar el salon' });
            }

            if (result.affectedRows === 0) {
                return res.json({ success: false, message: 'Salon no encontrado' });
            }

            res.json({ success: true, message: 'Salon eliminado correctamente' });
        });
    },

    // ================= LISTAR TODOS (nueva función) =================
    listar: async (req, res) => {
        try {
            const [rows] = await pool.query(
                'SELECT s.id, s.nombre, s.capacidad, s.profesor_id, p.nombre as profesor_nombre ' +
                'FROM salones s ' +
                'LEFT JOIN profesores p ON s.profesor_id = p.numero_de_control ' +
                'ORDER BY s.nombre ASC'
            );

            res.json({ 
                success: true, 
                salones: rows,
                total: rows.length
            });

        } catch (error) {
            console.error('Error listando salones:', error);
            return res.json({ 
                success: false, 
                message: 'Error al listar salones: ' + error.message 
            });
        }
    }
};