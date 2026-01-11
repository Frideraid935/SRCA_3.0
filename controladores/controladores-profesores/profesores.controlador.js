// controladores/controladores-profesores/profesores.controlador.js
// profesores.controlador.js - Controlador completo
const db = require('../../BD/BD.js');

const profesoresController = {

    // Listar todos los profesores (YA EXISTE - FUNCIONAL)
    listarProfesores: (req, res) => {
        const sql = 'SELECT numero_de_control, nombre FROM profesores';
        db.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al obtener profesores' });
            }
            res.json(rows);
        });
    },

    // ============ AÑADIR ESTAS FUNCIONES NUEVAS ============

    // Registrar nuevo profesor
    registrar: (req, res) => {
        const { numero_de_control, nombre, especialidad } = req.body;

        if (!numero_de_control || !nombre || !especialidad) {
            return res.json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const checkSql = 'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?';
        db.query(checkSql, [numero_de_control], (err, rows) => {
            if (err) {
                console.error('Error verificando profesor:', err);
                return res.json({
                    success: false,
                    message: 'Error al verificar profesor'
                });
            }

            if (rows.length > 0) {
                return res.json({
                    success: false,
                    message: 'Ya existe un profesor con este número de control'
                });
            }

            const insertSql = 'INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
            db.query(insertSql, [numero_de_control, nombre, especialidad], (err, result) => {
                if (err) {
                    console.error('Error registrando profesor:', err);
                    return res.json({
                        success: false,
                        message: 'Error al registrar profesor'
                    });
                }

                res.json({
                    success: true,
                    message: 'Profesor registrado correctamente',
                    id: result.insertId
                });
            });
        });
    },

    // Buscar profesor por número de control
    buscar: (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.json({
                success: false,
                message: 'Debe proporcionar un número de control'
            });
        }

        const sql = 'SELECT numero_de_control, nombre, especialidad FROM profesores WHERE numero_de_control = ?';
        db.query(sql, [id], (err, rows) => {
            if (err) {
                console.error('Error buscando profesor:', err);
                return res.json({
                    success: false,
                    message: 'Error al buscar profesor'
                });
            }

            if (rows.length === 0) {
                return res.json({
                    success: false,
                    message: 'Profesor no encontrado'
                });
            }

            res.json({
                success: true,
                profesor: rows[0]
            });
        });
    },

    // Actualizar profesor
    actualizar: (req, res) => {
        const { id } = req.params;
        const { nombre, especialidad } = req.body;

        if (!id || !nombre || !especialidad) {
            return res.json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const sql = 'UPDATE profesores SET nombre = ?, especialidad = ? WHERE numero_de_control = ?';
        db.query(sql, [nombre, especialidad, id], (err, result) => {
            if (err) {
                console.error('Error actualizando profesor:', err);
                return res.json({
                    success: false,
                    message: 'Error al actualizar profesor'
                });
            }

            if (result.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: 'Profesor no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Profesor actualizado correctamente'
            });
        });
    },

    // Eliminar profesor
    eliminar: (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.json({
                success: false,
                message: 'Debe proporcionar un número de control'
            });
        }

        const sql = 'DELETE FROM profesores WHERE numero_de_control = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error eliminando profesor:', err);
                return res.json({
                    success: false,
                    message: 'Error al eliminar profesor'
                });
            }

            if (result.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: 'Profesor no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Profesor eliminado correctamente'
            });
        });
    }

};

module.exports = profesoresController;