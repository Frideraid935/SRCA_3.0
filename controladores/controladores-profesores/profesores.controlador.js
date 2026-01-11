// profesores.controlador.js
const db = require('../../BD/BD.js');

const profesoresController = {

    // Registrar profesor
    registrarProfesor: async (req, res) => {
        try {
            console.log('====== REGISTRAR PROFESOR ======');
            console.log('Datos recibidos:', req.body);
            
            const { numero_de_control, nombre, especialidad } = req.body;

            if (!numero_de_control || !nombre || !especialidad) {
                console.log('Faltan campos');
                return res.json({ 
                    status: "error", 
                    message: "Todos los campos son obligatorios." 
                });
            }

            // Verificar si el número de control ya existe
            const checkSql = 'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?';
            
            db.query(checkSql, [numero_de_control], (err, rows) => {
                if (err) {
                    console.error("Error en registrarProfesor:", err);
                    return res.json({ 
                        status: "error", 
                        message: "Error al registrar el profesor." 
                    });
                }

                console.log('Resultado verificación:', rows);

                if (rows.length > 0) {
                    return res.json({ 
                        status: "error", 
                        message: "El número de control ya está registrado." 
                    });
                }

                // Insertar nuevo profesor
                const insertSql = 'INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
                
                db.query(insertSql, [numero_de_control, nombre, especialidad], (err, result) => {
                    if (err) {
                        console.error("Error en registrarProfesor:", err);
                        return res.json({ 
                            status: "error", 
                            message: "Error al registrar el profesor." 
                        });
                    }

                    console.log('Profesor insertado, ID:', result.insertId);
                    
                    res.json({ 
                        status: "success", 
                        message: "Profesor registrado exitosamente." 
                    });
                });
            });

        } catch (error) {
            console.error("Error en registrarProfesor:", error);
            res.json({ 
                status: "error", 
                message: "Error al registrar el profesor." 
            });
        }
    },

    // Buscar profesor por número de control
    buscarProfesorPorNumero: async (req, res) => {
        try {
            console.log('====== BUSCAR PROFESOR ======');
            const { numero } = req.params;
            console.log('Buscando número:', numero);
            
            if (!numero) {
                return res.json({ 
                    status: "error", 
                    message: "Debe proporcionar un número de control." 
                });
            }
            
            const sql = 'SELECT numero_de_control, nombre, especialidad FROM profesores WHERE numero_de_control = ?';
            
            db.query(sql, [numero], (err, rows) => {
                if (err) {
                    console.error("Error en buscarProfesorPorNumero:", err);
                    return res.json({ 
                        status: "error", 
                        message: "Error al buscar el profesor." 
                    });
                }

                console.log('Resultado búsqueda:', rows);

                if (rows.length === 0) {
                    return res.json({ 
                        status: "error", 
                        message: "Profesor no encontrado." 
                    });
                }

                res.json(rows[0]);
            });
            
        } catch (error) {
            console.error("Error en buscarProfesorPorNumero:", error);
            res.json({ 
                status: "error", 
                message: "Error al buscar el profesor." 
            });
        }
    },

    // Actualizar profesor
    actualizarProfesor: async (req, res) => {
        try {
            console.log('====== ACTUALIZAR PROFESOR ======');
            console.log('Datos recibidos:', req.body);
            
            const { numero_de_control, nombre, especialidad } = req.body;

            if (!numero_de_control || !nombre || !especialidad) {
                return res.json({ 
                    status: "error", 
                    message: "Todos los campos son obligatorios." 
                });
            }

            const sql = 'UPDATE profesores SET nombre = ?, especialidad = ? WHERE numero_de_control = ?';
            
            db.query(sql, [nombre, especialidad, numero_de_control], (err, result) => {
                if (err) {
                    console.error("Error en actualizarProfesor:", err);
                    return res.json({ 
                        status: "error", 
                        message: "Error al actualizar el profesor." 
                    });
                }

                console.log('Resultado actualización:', result);

                if (result.affectedRows === 0) {
                    return res.json({ 
                        status: "error", 
                        message: "Profesor no encontrado." 
                    });
                }

                res.json({ 
                    status: "success", 
                    message: "Profesor actualizado correctamente." 
                });
            });
            
        } catch (error) {
            console.error("Error en actualizarProfesor:", error);
            res.json({ 
                status: "error", 
                message: "Error al actualizar el profesor." 
            });
        }
    },

    // Eliminar profesor
    eliminarProfesor: async (req, res) => {
        try {
            console.log('====== ELIMINAR PROFESOR ======');
            console.log('Datos recibidos:', req.body);
            
            const { numero_de_control } = req.body;

            if (!numero_de_control) {
                return res.json({ 
                    status: "error", 
                    message: "Debe proporcionar un número de control." 
                });
            }

            // Primero, verificar si existen salones asignados
            const checkSalonesSql = 'SELECT id FROM salones WHERE profesor_id = ?';
            
            db.query(checkSalonesSql, [numero_de_control], (err, salones) => {
                if (err) {
                    console.error("Error en eliminarProfesor:", err);
                    return res.json({ 
                        status: "error", 
                        message: "Error al eliminar el profesor." 
                    });
                }

                console.log('Salones asignados:', salones);

                if (salones.length > 0) {
                    return res.json({ 
                        status: "error", 
                        message: "No se puede eliminar el profesor porque tiene salones asignados." 
                    });
                }

                // Guardar en tabla de eliminados
                const selectSql = 'SELECT * FROM profesores WHERE numero_de_control = ?';
                db.query(selectSql, [numero_de_control], (err, rows) => {
                    if (err) {
                        console.error("Error en eliminarProfesor:", err);
                    } else if (rows.length > 0) {
                        const profesor = rows[0];
                        const insertEliminadoSql = 'INSERT INTO profesores_eliminados (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
                        db.query(insertEliminadoSql, [profesor.numero_de_control, profesor.nombre, profesor.especialidad], (err) => {
                            if (err) console.error("Error guardando en eliminados:", err);
                        });
                    }

                    // Eliminar profesor
                    const deleteSql = 'DELETE FROM profesores WHERE numero_de_control = ?';
                    db.query(deleteSql, [numero_de_control], (err, result) => {
                        if (err) {
                            console.error("Error en eliminarProfesor:", err);
                            return res.json({ 
                                status: "error", 
                                message: "Error al eliminar el profesor." 
                            });
                        }

                        console.log('Resultado eliminación:', result);

                        if (result.affectedRows === 0) {
                            return res.json({ 
                                status: "error", 
                                message: "Profesor no encontrado." 
                            });
                        }

                        res.json({ 
                            status: "success", 
                            message: "Profesor eliminado correctamente." 
                        });
                    });
                });
            });
            
        } catch (error) {
            console.error("Error en eliminarProfesor:", error);
            res.json({ 
                status: "error", 
                message: "Error al eliminar el profesor." 
            });
        }
    }

};

module.exports = profesoresController;