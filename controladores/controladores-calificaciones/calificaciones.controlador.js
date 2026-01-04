const db = require('../../BD/BD').pool; // Usar pool de BD

const calificacionesController = {

    // ==============================
    // REGISTRAR CALIFICACIÓN
    // ==============================
    registrar: async (req, res) => {
        const { alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id } = req.body;

        if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        try {
            // Validar que el alumno existe
            const [alumno] = await db.query('SELECT * FROM alumnos WHERE numero_de_control = ?', [numero_de_control]);
            if (alumno.length === 0) return res.status(400).json({ message: 'Alumno no encontrado' });

            // Validar que la materia existe
            const [materia] = await db.query('SELECT * FROM materias WHERE id = ?', [materia_id]);
            if (materia.length === 0) return res.status(400).json({ message: 'Materia no encontrada' });

            // Validar que el profesor existe
            const [profesor] = await db.query('SELECT * FROM profesores WHERE numero_de_control = ?', [profesor_id]);
            if (profesor.length === 0) return res.status(400).json({ message: 'Profesor no encontrado' });

            // Insertar calificación
            await db.query(`
                INSERT INTO calificaciones
                (alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id)
                VALUES (?, ?, ?, ?, ?)
            `, [alumno_nombre, numero_de_control, materia_id, calificacion, profesor_id]);

            res.status(201).json({ message: 'Calificación registrada correctamente' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al registrar calificación' });
        }
    },

    // ==============================
    // BUSCAR POR ID
    // ==============================
    buscarPorId: async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM calificaciones WHERE id = ?', [id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Calificación no encontrada' });
            res.json(rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al buscar la calificación' });
        }
    },

    // ==============================
    // ACTUALIZAR CALIFICACIÓN
    // ==============================
    actualizar: async (req, res) => {
        const { id } = req.params;
        const { alumno_nombre, numero_de_control, materia_id, calificacion } = req.body;

        if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }

        try {
            // Verificar que la calificación exista
            const [existe] = await db.query('SELECT * FROM calificaciones WHERE id = ?', [id]);
            if (existe.length === 0) return res.status(404).json({ message: 'Calificación no encontrada' });

            // Actualizar
            await db.query(`
                UPDATE calificaciones SET
                    alumno_nombre = ?,
                    numero_de_control = ?,
                    materia_id = ?,
                    calificacion = ?
                WHERE id = ?
            `, [alumno_nombre, numero_de_control, materia_id, calificacion, id]);

            res.json({ message: 'Calificación actualizada correctamente' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar la calificación' });
        }
    }
};

module.exports = calificacionesController;
