const db = require('../../BD/BD.js');

const salonesController = {

    // REGISTRAR
    registrarSalon: async (req, res) => {
        try {
            const { id_salon, nombre_salon, capacidad, profesor_id } = req.body;

            if (!id_salon || !nombre_salon || !capacidad || !profesor_id) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                INSERT INTO salones (id_salon, nombre_salon, capacidad, profesor_id)
                VALUES (?, ?, ?, ?)
            `;

            await db.execute(sql, [id_salon, nombre_salon, capacidad, profesor_id]);

            res.json({ message: 'Salón registrado correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al registrar salón' });
        }
    },

    // BUSCAR
    buscarSalon: async (req, res) => {
        try {
            const { id } = req.params;

            const [rows] = await db.execute(
                'SELECT * FROM salones WHERE id_salon = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Salón no encontrado' });
            }

            res.json(rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al buscar salón' });
        }
    },

    // ELIMINAR
    eliminarSalon: async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.execute(
                'DELETE FROM salones WHERE id_salon = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Salón no encontrado' });
            }

            res.json({ message: 'Salón eliminado correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar salón' });
        }
    }
};

module.exports = salonesController;
