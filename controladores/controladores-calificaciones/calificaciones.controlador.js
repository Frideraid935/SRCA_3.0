const db = require('../../BD/BD.js');

const calificacionesController = {

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    async registrar(req, res) {
        try {
            let { alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id } = req.body;

            // Validar campos obligatorios
            if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Verificar que la materia exista
            const [materiaRows] = await db.query('SELECT id FROM materias WHERE id = ?', [materia_id]);
            if (materiaRows.length === 0) {
                return res.status(400).json({ message: `Materia con ID ${materia_id} no existe` });
            }

            // Verificar que el profesor exista
            const [profesorRows] = await db.query('SELECT numero_de_control FROM profesores WHERE numero_de_control = ?', [profesor_id]);
            if (profesorRows.length === 0) {
                return res.status(400).json({ message: `Profesor con número de control ${profesor_id} no existe` });
            }

            // Insertar calificación
            const sql = `
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.query(sql, [alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id]);

            res.status(201).json({ message: 'Calificación registrada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al registrar calificación (verifica alumno, materia o profesor)' });
        }
    },

    /* =========================
       BUSCAR CALIFICACIÓN POR ID
    ========================== */
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            const sql = `
                SELECT c.id, c.alumno_nombre, c.numero_de_control,
                       c.materia_id, m.nombre AS nombre_materia,
                       c.calificacion, c.profesor_id, p.nombre AS nombre_profesor
                FROM calificaciones c
                LEFT JOIN materias m ON c.materia_id = m.id
                LEFT JOIN profesores p ON c.profesor_id = p.numero_de_control
                WHERE c.id = ?
            `;

            const [rows] = await db.query(sql, [id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Calificación no encontrada' });

            res.json(rows[0]);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al buscar la calificación' });
        }
    },

    /* =========================
       ACTUALIZAR CALIFICACIÓN
    ========================== */
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            let { alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Verificar materia
            const [materiaRows] = await db.query('SELECT id FROM materias WHERE id = ?', [materia_id]);
            if (materiaRows.length === 0) {
                return res.status(400).json({ message: `Materia con ID ${materia_id} no existe` });
            }

            // Verificar profesor
            const [profesorRows] = await db.query('SELECT numero_de_control FROM profesores WHERE numero_de_control = ?', [profesor_id]);
            if (profesorRows.length === 0) {
                return res.status(400).json({ message: `Profesor con número de control ${profesor_id} no existe` });
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
            res.status(500).json({ message: 'Error al actualizar la calificación' });
        }
    }
};

module.exports = calificacionesController;
