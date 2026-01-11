const db = require('../../BD/BD.js');

const salonesController = {

    /* =========================
       REGISTRAR
    ========================= */
    registrar: async (req, res) => {
        try {
            const { nombre_salon, capacidad, profesor_id } = req.body;

            if (!nombre_salon || !capacidad || !profesor_id) {
                return res.status(400).json({ message: 'Datos incompletos' });
            }

            // Verificar profesor existente
            const [profesor] = await db.execute(
                'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?',
                [profesor_id]
            );

            if (profesor.length === 0) {
                return res.status(404).json({ message: 'Profesor no encontrado' });
            }

            await db.execute(
                'INSERT INTO salones (nombre, capacidad, profesor_id) VALUES (?, ?, ?)',
                [nombre_salon, capacidad, profesor_id]
            );

            res.json({ message: 'Salón registrado correctamente' });

        } catch (error) {
            console.error('ERROR REGISTRAR SALÓN:', error.message);
            res.status(500).json({ message: error.message });
        }
    },

    /* =========================
       BUSCAR
    ========================= */
    buscar: async (req, res) => {
        try {
            const { id } = req.params;

            const [rows] = await db.execute(`
                SELECT s.id, s.nombre, s.capacidad,
                       p.numero_de_control AS profesor_id,
                       p.nombre AS profesor_nombre
                FROM salones s
                JOIN profesores p ON s.profesor_id = p.numero_de_control
                WHERE s.id = ?
            `, [id]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Salón no encontrado' });
            }

            res.json(rows[0]);

        } catch (error) {
            console.error('ERROR BUSCAR SALÓN:', error.message);
            res.status(500).json({ message: error.message });
        }
    },

    /* =========================
       ELIMINAR
    ========================= */
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;

            const [existe] = await db.execute(
                'SELECT id FROM salones WHERE id = ?',
                [id]
            );

            if (existe.length === 0) {
                return res.status(404).json({ message: 'Salón no encontrado' });
            }

            await db.execute(
                'DELETE FROM salones WHERE id = ?',
                [id]
            );

            res.json({ message: 'Salón eliminado correctamente' });

        } catch (error) {
            console.error('ERROR ELIMINAR SALÓN:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = salonesController;
