const db = require('../../BD/BD.js');

const salonesController = {

    registrar: (req, res) => {
        const { nombre, capacidad, numero_de_control } = req.body;

        const sql = `
            INSERT INTO salones (nombre, capacidad, numero_de_control)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [nombre, capacidad, numero_de_control], (err) => {
            if (err) {
                return res.status(500).json({ message: "Error al registrar salón" });
            }
            res.json({ message: "Salón registrado correctamente" });
        });
    },

    buscar: (req, res) => {
        const { id } = req.params;

        const sql = "SELECT * FROM salones WHERE id = ?";
        db.query(sql, [id], (err, rows) => {
            if (err || rows.length === 0) {
                return res.status(404).json({ message: "Salón no encontrado" });
            }
            res.json(rows[0]);
        });
    },

    eliminar: (req, res) => {
        const { id } = req.params;

        const sql = "DELETE FROM salones WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err || result.affectedRows === 0) {
                return res.status(404).json({ message: "Salón no encontrado" });
            }
            res.json({ message: "Salón eliminado correctamente" });
        });
    }
};

module.exports = salonesController;
