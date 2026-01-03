const db = require('../../BD/BD');

const calificacionesController = {

    registrar(req, res) {
        const {
            alumno_nombre,
            numero_de_control,
            materia_id,
            calificacion,
            profesor_id
        } = req.body;

        if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
            return res.json({ success: false, message: 'Todos los campos son obligatorios' });
        }

        const sql = `
            INSERT INTO calificaciones
            (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            alumno_nombre,
            numero_de_control,
            materia_id,
            calificacion,
            profesor_id
        ], err => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Error al registrar calificación' });
            }

            res.json({ success: true, message: 'Calificación registrada correctamente' });
        });
    },

    buscar(req, res) {
        const { id } = req.query;

        const sql = 'SELECT * FROM calificaciones WHERE id = ?';
        db.query(sql, [id], (err, rows) => {
            if (err) return res.json({ success: false, message: 'Error al buscar' });
            if (rows.length === 0) {
                return res.json({ success: false, message: 'Calificación no encontrada' });
            }

            res.json({ success: true, calificacion: rows[0] });
        });
    },

    actualizar(req, res) {
        const {
            id,
            alumno_nombre,
            numero_de_control,
            materia_id,
            calificacion,
            profesor_id
        } = req.body;

        const sql = `
            UPDATE calificaciones SET
                alumno_nombre = ?,
                numero_de_control = ?,
                materia_id = ?,
                calificacion = ?,
                profesor_id = ?
            WHERE id = ?
        `;

        db.query(sql, [
            alumno_nombre,
            numero_de_control,
            materia_id,
            calificacion,
            profesor_id,
            id
        ], err => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Error al actualizar' });
            }

            res.json({ success: true, message: 'Calificación actualizada correctamente' });
        });
    }
};

module.exports = calificacionesController;
