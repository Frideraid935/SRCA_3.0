const db = require('../../BD/BD.js');

const calificacionesController = {

    // =========================
    // Registrar calificación
    // =========================
    async registrar(req, res) {
        try {
            const { alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.json({ success: false, message: 'Todos los campos son obligatorios' });
            }

            // Obtener ids de materia y profesor
            const [materia] = await db.query('SELECT id FROM materias WHERE nombre = ?', [materia_nombre]);
            const [profesor] = await db.query('SELECT numero_de_control FROM profesores WHERE nombre = ?', [profesor_nombre]);

            if (!materia.length) return res.json({ success: false, message: 'Materia no encontrada' });
            if (!profesor.length) return res.json({ success: false, message: 'Profesor no encontrado' });

            const sql = `
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.query(sql, [alumno_nombre, numero_de_control, materia[0].id, calificacion, profesor[0].numero_de_control]);

            res.json({ success: true, message: 'Calificación registrada correctamente' });

        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Error al registrar calificación' });
        }
    },

    // =========================
    // Buscar calificación por alumno + materia
    // =========================
    async buscar(req, res) {
        try {
            const { alumno_nombre, materia_nombre } = req.query;

            if (!alumno_nombre || !materia_nombre) {
                return res.json({ success: false, message: 'Alumno y materia son requeridos' });
            }

            const [materia] = await db.query('SELECT id FROM materias WHERE nombre = ?', [materia_nombre]);
            if (!materia.length) return res.json({ success: false, message: 'Materia no encontrada' });

            const sql = `
                SELECT c.id, c.alumno_nombre, c.numero_de_control, c.materia_id,
                       m.nombre AS nombre_materia, c.calificacion,
                       c.profesor_id, p.nombre AS nombre_profesor
                FROM calificaciones c
                LEFT JOIN materias m ON c.materia_id = m.id
                LEFT JOIN profesores p ON c.profesor_id = p.numero_de_control
                WHERE c.alumno_nombre = ? AND c.materia_id = ?
                LIMIT 1
            `;
            const [rows] = await db.query(sql, [alumno_nombre, materia[0].id]);

            if (!rows.length) return res.json({ success: false, message: 'Calificación no encontrada' });

            res.json({ success: true, data: rows[0] });

        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Error al buscar calificación' });
        }
    },

    // =========================
    // Actualizar calificación por id
    // =========================
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.json({ success: false, message: 'Todos los campos son obligatorios' });
            }

            const [materia] = await db.query('SELECT id FROM materias WHERE nombre = ?', [materia_nombre]);
            const [profesor] = await db.query('SELECT numero_de_control FROM profesores WHERE nombre = ?', [profesor_nombre]);

            if (!materia.length) return res.json({ success: false, message: 'Materia no encontrada' });
            if (!profesor.length) return res.json({ success: false, message: 'Profesor no encontrado' });

            const sql = `
                UPDATE calificaciones SET
                    alumno_nombre = ?, numero_de_control = ?, materia_id = ?,
                    calificacion = ?, profesor_id = ?
                WHERE id = ?
            `;
            const [result] = await db.query(sql, [alumno_nombre, numero_de_control, materia[0].id, calificacion, profesor[0].numero_de_control, id]);

            if (result.affectedRows === 0) return res.json({ success: false, message: 'Calificación no encontrada' });

            res.json({ success: true, message: 'Calificación actualizada correctamente' });

        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Error al actualizar calificación' });
        }
    }

};

module.exports = calificacionesController;
