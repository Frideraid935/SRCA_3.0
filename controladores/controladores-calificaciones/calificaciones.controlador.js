const db = require('../../BD/BD');

const calificacionesController = {

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    registrar(req, res) {
        const {
            alumno_nombre,
            numero_de_control,
            materia_id,
            calificacion,
            profesor_id
        } = req.body;

        if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
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
        ], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: 'Error al registrar calificación (verifica alumno, materia o profesor)'
                });
            }

            res.status(201).json({ message: 'Calificación registrada correctamente' });
        });
    },

    /* =========================
       BUSCAR POR ID
       GET /api/calificaciones/:id
    ========================== */
    buscarPorId(req, res) {
        const { id } = req.params;

        const sql = `
            SELECT c.*
            FROM calificaciones c
            WHERE c.id = ?
        `;

        db.query(sql, [id], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al buscar la calificación' });
            }

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Calificación no encontrada' });
            }

            res.json(rows[0]);
        });
    },

    /* =========================
       ACTUALIZAR CALIFICACIÓN
       PUT /api/calificaciones/actualizar/:id
    ========================== */
    actualizar(req, res) {
        const { id } = req.params;
        const {
            alumno_nombre,
            numero_de_control,
            materia_id,
            calificacion
        } = req.body;

        if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }

        const sql = `
            UPDATE calificaciones SET
                alumno_nombre = ?,
                numero_de_control = ?,
                materia_id = ?,
                calificacion = ?
            WHERE id = ?
        `;

        db.query(sql, [
            alumno_nombre,
            numero_de_control,
            materia_id,
            calificacion,
            id
        ], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al actualizar la calificación' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Calificación no encontrada' });
            }

            res.json({ message: 'Calificación actualizada correctamente' });
        });
    }
};

module.exports = calificacionesController;
