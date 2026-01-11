// profesores.controlador.js
const db = require('../../BD/BD.js');

const profesoresController = {

    // Listar todos los profesores
    listarProfesores: (req, res) => {
        const sql = 'SELECT numero_de_control, nombre, especialidad FROM profesores ORDER BY nombre';
        db.query(sql, (err, rows) => {
            if (err) {
                console.error('Error listando profesores:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error al obtener profesores' 
                });
            }
            res.json({
                success: true,
                profesores: rows
            });
        });
    },

    // Registrar nuevo profesor
    registrar: (req, res) => {
        const { numero_de_control, nombre, especialidad } = req.body;

        console.log('Datos recibidos para registrar:', { numero_de_control, nombre, especialidad });

        if (!numero_de_control || !nombre || !especialidad) {
            return res.json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si ya existe
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

            // Insertar nuevo profesor
            const insertSql = 'INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
            db.query(insertSql, [numero_de_control, nombre, especialidad], (err, result) => {
                if (err) {
                    console.error('Error registrando profesor:', err);
                    return res.json({
                        success: false,
                        message: 'Error al registrar profesor: ' + err.message
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

        console.log('Buscando profesor con ID:', id);

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

        console.log('Actualizando profesor:', { id, nombre, especialidad });

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

        console.log('Eliminando profesor ID:', id);

        if (!id) {
            return res.json({
                success: false,
                message: 'Debe proporcionar un número de control'
            });
        }

        // Primero, verificar si existen salones asignados
        const checkSalonesSql = 'SELECT id FROM salones WHERE profesor_id = ?';
        db.query(checkSalonesSql, [id], (err, salones) => {
            if (err) {
                console.error('Error verificando salones:', err);
                return res.json({
                    success: false,
                    message: 'Error al verificar salones asignados'
                });
            }

            if (salones.length > 0) {
                return res.json({
                    success: false,
                    message: 'No se puede eliminar el profesor porque tiene salones asignados'
                });
            }

            // Guardar en tabla de eliminados
            const selectSql = 'SELECT * FROM profesores WHERE numero_de_control = ?';
            db.query(selectSql, [id], (err, rows) => {
                if (err) {
                    console.error('Error seleccionando profesor:', err);
                } else if (rows.length > 0) {
                    const profesor = rows[0];
                    const insertEliminadoSql = 'INSERT INTO profesores_eliminados (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
                    db.query(insertEliminadoSql, [profesor.numero_de_control, profesor.nombre, profesor.especialidad], (err) => {
                        if (err) console.error('Error guardando en eliminados:', err);
                    });
                }

                // Eliminar profesor
                const deleteSql = 'DELETE FROM profesores WHERE numero_de_control = ?';
                db.query(deleteSql, [id], (err, result) => {
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
            });
        });
    }

};

module.exports = profesoresController;