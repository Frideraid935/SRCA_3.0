const db = require('../../BD/BD.js');

const calificacionesController = {

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    async registrar(req, res) {
        try {
            const { alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Insertar en la tabla de calificaciones
            const sql = `
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.query(sql, [alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre]);

            res.status(201).json({ message: 'Calificación registrada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al registrar calificación' });
        }
    },

    /* =========================
       BUSCAR CALIFICACIÓN POR ID
    ========================== */
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            const sql = `
                SELECT *
                FROM calificaciones
                WHERE id = ?
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
       BUSCAR POR ALUMNO Y MATERIA
    ========================== */
    async buscarPorAlumnoMateria(req, res) {
        try {
            const { alumno, materia } = req.query;

            if (!alumno || !materia) {
                return res.status(400).json({ message: 'Alumno y materia son requeridos' });
            }

            const sql = `
                SELECT *
                FROM calificaciones
                WHERE alumno_nombre = ? AND materia_nombre = ?
            `;
            const [rows] = await db.query(sql, [alumno, materia]);

            res.json(rows);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al buscar calificación por alumno y materia' });
        }
    },

    /* =========================
       ACTUALIZAR CALIFICACIÓN
    ========================== */
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                UPDATE calificaciones SET
                    alumno_nombre = ?, numero_de_control = ?, materia_nombre = ?,
                    calificacion = ?, profesor_nombre = ?
                WHERE id = ?
            `;
            const [result] = await db.query(sql, [alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Calificación no encontrada para actualizar' });
            }

            res.json({ message: 'Calificación actualizada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar la calificación' });
        }
    }

};

module.exports = calificacionesController;
