// salones.controlador.js
const pool = require('../../BD/BD');

module.exports = {
    // ================= BUSCAR ================= 
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

    // ================= REGISTRAR =================
    registrar: async (req, res) => {
        try {
            const { nombre, capacidad, profesor_id } = req.body;

            if (!nombre || !capacidad || !profesor_id) {
                return res.json({
                    success: false,
                    message: 'Todos los campos son obligatorios'
                });
            }

            // Verificar que el profesor existe (por integridad referencial)
            const [profesorExists] = await pool.query(
                'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?',
                [profesor_id]
            );

            if (profesorExists.length === 0) {
                return res.json({
                    success: false,
                    message: 'El profesor con este número de control no existe'
                });
            }

            const [result] = await pool.query(
                'INSERT INTO salones (nombre, capacidad, profesor_id) VALUES (?, ?, ?)',
                [nombre, capacidad, profesor_id]
            );

            res.json({ 
                success: true, 
                message: 'Salon registrado correctamente', 
                id: result.insertId 
            });

        } catch (error) {
            console.error('Error al registrar salon:', error);
            return res.json({ 
                success: false, 
                message: 'Error al registrar el salon: ' + error.message 
            });
        }
    },

    // ================= ELIMINAR =================
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.json({ 
                    success: false, 
                    message: 'Debes proporcionar un ID de salon' 
                });
            }

            const [result] = await pool.query(
                'DELETE FROM salones WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.json({ 
                    success: false, 
                    message: 'Salon no encontrado' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Salon eliminado correctamente' 
            });

        } catch (error) {
            console.error('Error al eliminar salon:', error);
            return res.json({ 
                success: false, 
                message: 'Error al eliminar el salon: ' + error.message 
            });
        }
    },

    // ================= LISTAR TODOS (agregar esta función) =================
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