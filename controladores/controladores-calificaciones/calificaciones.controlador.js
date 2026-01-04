const db = require('../../BD/BD.js');

const calificacionesController = {

    // ================== REGISTRAR ==================
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

    // ================== BUSCAR POR NOMBRE Y MATERIA ==================
    async buscar(req, res) {
        try {
            const { alumno_nombre, materia_id } = req.query;

            if (!alumno_nombre || !materia_id) {
                return res.status(400).json({ message: 'Alumno y Materia son requeridos' });
            }

            const sql = `
                SELECT * FROM calificaciones
                WHERE alumno_nombre = ? AND materia_id = ?
            `;

            const [rows] = await db.query(sql, [alumno_nombre, materia_id]);

            if (rows.length === 0) return res.status(404).json({ message: 'Calificación no encontrada' });

            res.json(rows[0]);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al buscar calificación' });
        }
    },

    // ================== ACTUALIZAR ==================
    async actualizar(req, res) {
        try {
            const { alumno_nombre, materia_id, calificacion, profesor_id } = req.body;

            if (!alumno_nombre || !materia_id || !calificacion || !profesor_id) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const sql = `
                UPDATE calificaciones
                SET calificacion = ?, profesor_id = ?
                WHERE alumno_nombre = ? AND materia_id = ?
            `;

            const [result] = await db.query(sql, [calificacion, profesor_id, alumno_nombre, materia_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No se encontró calificación para ese alumno y materia' });
            }

            res.json({ message: 'Calificación actualizada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar calificación' });
        }
    }
};

module.exports = calificacionesController;
