const db = require('../../BD/BD.js');

const calificacionesController = {

    // Registrar calificación
    async registrar(req, res) {
        try {
            const { alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Obtener ids de materia y profesor
            const [materia] = await db.query('SELECT id FROM materias WHERE nombre = ?', [materia_nombre]);
            const [profesor] = await db.query('SELECT numero_de_control FROM profesores WHERE nombre = ?', [profesor_nombre]);

            if (!materia.length) return res.status(404).json({ message: 'Materia no encontrada' });
            if (!profesor.length) return res.status(404).json({ message: 'Profesor no encontrado' });

            const sql = `
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.query(sql, [alumno_nombre, numero_de_control, materia[0].id, calificacion, profesor[0].numero_de_control]);

            res.status(201).json({ message: 'Calificación registrada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al registrar calificación' });
        }
    },

    // Buscar calificación por Alumno + Materia
    async buscar(req, res) {
        try {
            const { alumno_nombre, materia_nombre } = req.query;

            if (!alumno_nombre || !materia_nombre) {
                return res.status(400).json({ message: 'Alumno y materia son requeridos' });
            }

            const [materia] = await db.query('SELECT id FROM materias WHERE nombre = ?', [materia_nombre]);
            if (!materia.length) return res.status(404).json({ message: 'Materia no encontrada' });

            const sql = `
                SELECT c.id, c.alumno_nombre, c.numero_de_control, c.materia_id,
                       m.nombre AS nombre_materia, c.calificacion,
                       c.profesor_id, p.nombre AS nombre_profesor
                FROM calificaciones c
                LEFT JOIN materias m ON c.materia_id = m.id
                LEFT JOIN profesores p ON c.profesor_id = p.numero_de_control
                WHERE c.alumno_nombre = ? AND c.materia_id = ?
            `;

            const [rows] = await db.query(sql, [alumno_nombre, materia[0].id]);
            if (!rows.length) return res.status(404).json({ message: 'Calificación no encontrada' });

            res.json(rows[0]);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al buscar calificación' });
        }
    },

    // Actualizar calificación por Alumno + Materia
    async actualizar(req, res) {
        try {
            const { alumno_nombre, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const [materia] = await db.query('SELECT id FROM materias WHERE nombre = ?', [materia_nombre]);
            const [profesor] = await db.query('SELECT numero_de_control FROM profesores WHERE nombre = ?', [profesor_nombre]);

            if (!materia.length) return res.status(404).json({ message: 'Materia no encontrada' });
            if (!profesor.length) return res.status(404).json({ message: 'Profesor no encontrado' });

            // Actualizar calificación según Alumno + Materia
            const sql = `
                UPDATE calificaciones
                SET calificacion = ?, profesor_id = ?
                WHERE alumno_nombre = ? AND materia_id = ?
            `;

            const [result] = await db.query(sql, [calificacion, profesor[0].numero_de_control, alumno_nombre, materia[0].id]);

            if (result.affectedRows === 0) return res.status(404).json({ message: 'Calificación no encontrada para actualizar' });

            res.json({ message: 'Calificación actualizada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar calificación' });
        }
    }
};

module.exports = calificacionesController;
