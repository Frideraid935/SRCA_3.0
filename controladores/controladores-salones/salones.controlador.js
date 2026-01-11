const db = require('../../BD/BD');

const salonesController = {

    // =====================
    // REGISTRAR (NO SE TOCA)
    // =====================
    registrar: (req, res) => {
        const { nombre, capacidad, profesor_id } = req.body;

        const sql = `
            INSERT INTO salones (nombre, capacidad, profesor_id)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [nombre, capacidad, profesor_id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al registrar salón' });
            }
            res.json({ message: 'Salón registrado correctamente' });
        });
    },

    // =====================
    // BUSCAR
    // =====================
    buscar: (req, res) => {
        const { id } = req.params;

        const sql = 'SELECT * FROM salones WHERE id = ?';

        db.query(sql, [id], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al buscar salón' });
            }

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Salón no encontrado' });
            }

            res.json({
                message: 'Salón encontrado',
                salon: rows[0]
            });
        });
    },

    // =====================
    // ELIMINAR
    // =====================
    eliminar: (req, res) => {
        const { id } = req.params;

        const sql = 'DELETE FROM salones WHERE id = ?';

        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al eliminar salón' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Salón no encontrado para eliminar' });
            }

            res.json({ message: 'Salón eliminado correctamente' });
        });
    }
};

module.exports = salonesController;
