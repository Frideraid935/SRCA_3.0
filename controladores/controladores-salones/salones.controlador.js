const db = require('../../BD/BD.js');

const salonesController = {

    registrarSalon: (req, res) => {
        const { id_salon, nombre_salon, capacidad, profesor_id } = req.body;

        if (!id_salon || !nombre_salon || !capacidad || !profesor_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const sql = `
            INSERT INTO salones (id_salon, nombre_salon, capacidad, profesor_id)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [id_salon, nombre_salon, capacidad, profesor_id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al registrar salón' });
            }
            res.json({ message: 'Salón registrado correctamente' });
        });
    },

    buscarSalon: (req, res) => {
        const { id } = req.params;

        const sql = 'SELECT * FROM salones WHERE id_salon = ?';
        db.query(sql, [id], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al buscar salón' });
            }
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Salón no encontrado' });
            }
            res.json(rows[0]);
        });
    },

    eliminarSalon: (req, res) => {
        const { id } = req.params;

        const sql = 'DELETE FROM salones WHERE id_salon = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al eliminar salón' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Salón no encontrado' });
            }
            res.json({ message: 'Salón eliminado correctamente' });
        });
    }
};

module.exports = salonesController;
