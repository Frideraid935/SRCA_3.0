const db = require('../../BD/BD'); // Ajusta la ruta según tu estructura

module.exports = {

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
                console.error(err);
                return res.json({ success: false, message: 'Error al registrar el salón' });
            }
            res.json({ success: true, message: 'Salón registrado correctamente', id: result.insertId });
        });
    },

    // ================= BUSCAR POR ID =================
    buscar: (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.json({
                success: false,
                message: 'Debes proporcionar un ID de salón'
            });
        }

        const sql = 'SELECT id, nombre, capacidad, profesor_id FROM salones WHERE id = ?';
        db.query(sql, [id], (err, rows) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Error al buscar el salón' });
            }

            if (rows.length === 0) {
                return res.json({ success: false, message: 'Salón no encontrado' });
            }

            res.json({ success: true, salon: rows[0] });
        });
    },

    // ================= ELIMINAR =================
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
