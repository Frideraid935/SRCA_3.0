// controladores/calificaciones.controlador.js
const pool = require('../../BD/BD');

module.exports = {
    // Buscar calificaciones por número de control del alumno
    buscarPorAlumno: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.json({
                    success: false,
                    message: 'Debe proporcionar un número de control'
                });
            }
            
            // 1. Buscar información del alumno
            const [alumnos] = await pool.query(
                'SELECT numero_de_control, nombre, curso FROM alumnos WHERE numero_de_control = ?',
                [id]
            );
            
            if (alumnos.length === 0) {
                return res.json({
                    success: false,
                    message: 'Alumno no encontrado'
                });
            }
            
            const alumno = alumnos[0];
            
            // 2. Buscar calificaciones del alumno
            const [calificaciones] = await pool.query(`
                SELECT 
                    c.id,
                    c.calificacion,
                    m.nombre as materia_nombre,
                    p.nombre as profesor_nombre
                FROM calificaciones c
                LEFT JOIN materias m ON c.materia_id = m.id
                LEFT JOIN profesores p ON c.profesor_id = p.numero_de_control
                WHERE c.numero_de_control = ?
                ORDER BY m.nombre ASC
            `, [id]);
            
            res.json({
                success: true,
                alumno: alumno,
                calificaciones: calificaciones,
                total: calificaciones.length
            });
            
        } catch (error) {
            console.error('Error buscando calificaciones:', error);
            return res.json({
                success: false,
                message: 'Error en la base de datos: ' + error.message
            });
        }
    }
};