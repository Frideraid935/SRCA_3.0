const db = require('../../BD/BD.js');

const calificacionesController = {

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    async registrar(req, res) {
        try {
            const { alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre } = req.body;

            if (!alumno_nombre || !numero_de_control || !materia_nombre || !calificacion || !profesor_nombre) {
                return res.json({ success: false, message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.query(sql, [alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre]);

            res.json({ success: true, message: 'Calificación registrada correctamente' });

        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Error al registrar calificación' });
        }
    },

    /* =========================
       BUSCAR CALIFICACIÓN POR ALUMNO + MATERIA
    ========================== */
    async buscarPorAlumnoMateria(req, res) {
        try {
            const { alumno, materia } = req.query;

            if (!alumno || !materia) {
                return res.json({ success: false, message: 'Alumno y Materia son requeridos' });
            }

            const sql = `
                SELECT * FROM calificaciones
                WHERE alumno_nombre = ? AND materia_nombre = ?
                LIMIT 1
            `;
            const [rows] = await db.query(sql, [alumno, materia]);

            if (rows.length === 0) {
                return res.json({ success: false, message: 'No se encontró la calificación' });
            }

            res.json({ success: true, data: rows[0] });

        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Error al buscar calificación' });
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
                return res.json({ success: false, message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                UPDATE calificaciones SET
                    alumno_nombre = ?, numero_de_control = ?, materia_nombre = ?,
                    calificacion = ?, profesor_nombre = ?
                WHERE id = ?
            `;
            const [result] = await db.query(sql, [alumno_nombre, numero_de_control, materia_nombre, calificacion, profesor_nombre, id]);

            if (result.affectedRows === 0) {
                return res.json({ success: false, message: 'No se encontró la calificación a actualizar' });
            }

            res.json({ success: true, message: 'Calificación actualizada correctamente' });

        } catch (err) {
            console.error(err);
            res.json({ success: false, message: 'Error al actualizar calificación' });
        }
    }
};

module.exports = calificacionesController;
