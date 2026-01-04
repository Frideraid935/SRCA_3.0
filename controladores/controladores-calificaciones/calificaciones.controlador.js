const db = require('../../BD/BD.js');

const calificacionesController = {

    // =========================
    // REGISTRAR CALIFICACIÓN
    // =========================
    async registrar(req, res) {
        try {
            const { alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
                VALUES (?, ?, 
                    (SELECT id FROM materias WHERE nombre = ? LIMIT 1),
                    ?, 
                    (SELECT numero_de_control FROM profesores WHERE nombre = ? LIMIT 1)
                )
            `;

            await db.query(sql, [alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre]);

            res.status(201).json({ message: 'Calificación registrada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al registrar calificación (verifica alumno, materia o profesor)' });
        }
    },

    // =========================
    // BUSCAR CALIFICACIÓN POR NOMBRE DEL ALUMNO
    // =========================
    async buscarPorNombre(req, res) {
        try {
            const { nombre } = req.query;
            if(!nombre) return res.status(400).json({ message: 'Se requiere nombre de alumno' });

            const sql = `
                SELECT c.id, c.alumno_nombre, c.numero_de_control,
                       c.materia_id, m.nombre AS nombre_materia,
                       c.calificacion, c.profesor_id, p.nombre AS nombre_profesor
                FROM calificaciones c
                LEFT JOIN materias m ON c.materia_id = m.id
                LEFT JOIN profesores p ON c.profesor_id = p.numero_de_control
                WHERE c.alumno_nombre LIKE ?
            `;

            const [rows] = await db.query(sql, [`%${nombre}%`]);
            res.json(rows);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al buscar calificaciones' });
        }
    },

    // =========================
    // ACTUALIZAR CALIFICACIÓN
    // =========================
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                UPDATE calificaciones SET
                    alumno_nombre = ?, 
                    numero_de_control = ?, 
                    materia_id = (SELECT id FROM materias WHERE nombre = ? LIMIT 1),
                    calificacion = ?, 
                    profesor_id = (SELECT numero_de_control FROM profesores WHERE nombre = ? LIMIT 1)
                WHERE id = ?
            `;

            const [result] = await db.query(sql, [alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre, id]);

            if(result.affectedRows === 0) return res.status(404).json({ message: 'Calificación no encontrada' });

            res.json({ message: 'Calificación actualizada correctamente' });

        } catch(err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar calificación' });
        }
    }

};

module.exports = calificacionesController;
