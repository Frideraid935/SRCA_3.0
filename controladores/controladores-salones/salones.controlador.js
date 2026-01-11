const db = require('../../BD/BD'); // Ajusta la ruta según tu estructura

module.exports = {

    // ================= REGISTRAR ================= (NO MODIFICAR)
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
                console.error(err);
                return res.json({ success: false, message: 'Error al registrar el salón' });
            }
            res.json({ success: true, message: 'Salón registrado correctamente', id: result.insertId });
        });
    },

    // ================= BUSCAR POR ID ================= (MEJORADO)
    buscar: (req, res) => {
        const { id } = req.params;

        console.log(`[API] Buscando salón con ID: ${id}`);

        if (!id || isNaN(id)) {
            return res.json({
                success: false,
                message: 'Debes proporcionar un ID de salón válido'
            });
        }

        const sql = 'SELECT id, nombre, capacidad, profesor_id FROM salones WHERE id = ?';
        db.query(sql, [parseInt(id)], (err, rows) => {
            if (err) {
                console.error('[API] Error en consulta SQL:', err);
                return res.json({ 
                    success: false, 
                    message: 'Error al buscar el salón en la base de datos' 
                });
            }

            console.log(`[API] Resultados encontrados: ${rows.length}`);

            if (rows.length === 0) {
                return res.json({ 
                    success: false, 
                    message: `No se encontró ningún salón con ID: ${id}` 
                });
            }

            const salon = rows[0];
            console.log('[API] Datos encontrados:', salon);
            
            res.json({ 
                success: true, 
                salon: {
                    id: salon.id,
                    nombre: salon.nombre,
                    capacidad: salon.capacidad,
                    profesor_id: salon.profesor_id
                }
            });
        });
    },

    // ================= ELIMINAR ================= (NO MODIFICAR)
    eliminar: (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.json({ success: false, message: 'Debes proporcionar un ID de salón' });
        }

        const sql = 'DELETE FROM salones WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Error al eliminar el salón' });
            }

            if (result.affectedRows === 0) {
                return res.json({ success: false, message: 'Salón no encontrado' });
            }

            res.json({ success: true, message: 'Salón eliminado correctamente' });
        });
    }

};