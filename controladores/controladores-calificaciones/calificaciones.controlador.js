// Importar la conexión a la base de datos
const db = require('../../BD/BD.js');

const calificacionesController = {

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    registrar: async (req, res) => {
        const { alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id } = req.body;

        // Validar que todos los campos estén presentes
        if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        try {
            const sql = `
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            await db.query(sql, [alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id]);
            res.status(201).json({ message: 'Calificación registrada correctamente' });

        } catch (error) {
            console.error('Error al registrar calificación:', error.message);
            res.status(500).json({
                message: 'Error al registrar calificación. Verifica que alumno, materia y profesor existan.'
            });
        }
    },

    /* =========================
       BUSCAR CALIFICACIÓN POR ID
       Devuelve datos completos (alumno, materia, profesor)
    ========================== */
    buscarPorId: async (req, res) => {
        const { id } = req.params;

        const sql = `
            SELECT 
                c.id,
                c.alumno_nombre,
                c.numero_de_control,
                c.materia_id,
                m.nombre AS materia_nombre,
                c.calificacion,
                c.profesor_id,
                p.nombre AS profesor_nombre
            FROM calificaciones c
            JOIN materias m ON c.materia_id = m.id
            JOIN profesores p ON c.profesor_id = p.numero_de_control
            WHERE c.id = ?
        `;

        try {
            const [rows] = await db.query(sql, [id]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Calificación no encontrada' });
            }

            res.json(rows[0]);

        } catch (error) {
            console.error('Error al buscar calificación:', error.message);
            res.status(500).json({ message: 'Error al buscar la calificación' });
        }
    },

    /* =========================
       ACTUALIZAR CALIFICACIÓN
    ========================== */
    actualizar: async (req, res) => {
        const { id } = req.params;
        const { alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id } = req.body;

        // Validar campos obligatorios
        if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }

        const sql = `
            UPDATE calificaciones SET
                alumno_nombre = ?,
                numero_de_control = ?,
                materia_id = ?,
                calificacion = ?,
                profesor_id = ?
            WHERE id = ?
        `;

        try {
            const [result] = await db.query(sql, [alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Calificación no encontrada' });
            }

            res.json({ message: 'Calificación actualizada correctamente' });

        } catch (error) {
            console.error('Error al actualizar calificación:', error.message);
            res.status(500).json({ message: 'Error al actualizar la calificación. Verifica los datos.' });
        }
    }
};

module.exports = calificacionesController;
