const db = require('../../BD/BD.js');

const calificacionesController = {

    // =========================
    // REGISTRAR CALIFICACIÓN
    // =========================
    async registrar(req, res) {
        try {
            const { alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            await db.query(sql, [alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id]);

            res.status(201).json({ message: 'Calificación registrada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al registrar calificación' });
        }
    },

    // =========================
    // LISTAR TODAS LAS CALIFICACIONES
    // =========================
    async listar(req, res) {
        try {
            const sql = `
                SELECT c.id, c.alumno_nombre, c.numero_de_control,
                       c.materia_id, m.nombre AS nombre_materia,
                       c.calificacion, c.profesor_id, p.nombre AS nombre_profesor
                FROM calificaciones c
                LEFT JOIN materias m ON c.materia_id = m.id
                LEFT JOIN profesores p ON c.profesor_id = p.numero_de_control
            `;
            const [rows] = await db.query(sql);
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al listar calificaciones' });
        }
    },

    // =========================
    // ACTUALIZAR CALIFICACIÓN POR ID
    // =========================
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                UPDATE calificaciones SET
                    alumno_nombre = ?, numero_de_control = ?, materia_id = ?,
                    calificacion = ?, profesor_id = ?
                WHERE id = ?
            `;

            const [result] = await db.query(sql, [alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id, id]);

            if (result.affectedRows === 0) return res.status(404).json({ message: 'Calificación no encontrada' });

            res.json({ message: 'Calificación actualizada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar calificación' });
        }
    }
};

module.exports = calificacionesController;
