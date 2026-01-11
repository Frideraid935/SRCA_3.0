// profesores.controlador.js
const pool = require("../../BD/BD");

const profesoresController = {
    // Registrar profesor
    registrar: (req, res) => {
        const { numero_de_control, nombre, especialidad } = req.body;
        
        if (!numero_de_control || !nombre || !especialidad) {
            return res.json({ 
                success: false, 
                message: 'Todos los campos son obligatorios' 
            });
        }
        
        // Validar formato de número de control (8 caracteres)
        if (numero_de_control.length !== 8) {
            return res.json({ 
                success: false, 
                message: 'El número de control debe tener 8 caracteres' 
            });
        }
        
        const checkSql = 'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?';
        
        pool.query(checkSql, [numero_de_control], (err, result) => {
            if (err) {
                console.error('Error verificando profesor:', err);
                return res.json({ 
                    success: false, 
                    message: 'Error en la base de datos' 
                });
            }
            
            if (result.length > 0) {
                return res.json({ 
                    success: false, 
                    message: 'Ya existe un profesor con este número de control' 
                });
            }
            
            const insertSql = 'INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
            
            pool.query(insertSql, [numero_de_control, nombre, especialidad], (err, result) => {
                if (err) {
                    console.error('Error registrando profesor:', err);
                    return res.json({ 
                        success: false, 
                        message: 'Error al registrar profesor' 
                    });
                }
                
                res.json({ 
                    success: true, 
                    message: 'Profesor registrado correctamente'
                });
            });
        });
    },
    
    // Buscar profesor
    buscar: (req, res) => {
        const { id } = req.params;
        
        if (!id) {
            return res.json({ 
                success: false, 
                message: 'Debe proporcionar un número de control' 
            });
        }
        
        const sql = 'SELECT numero_de_control, nombre, especialidad FROM profesores WHERE numero_de_control = ?';
        
        pool.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error buscando profesor:', err);
                return res.json({ 
                    success: false, 
                    message: 'Error en la base de datos' 
                });
            }
            
            if (result.length === 0) {
                return res.json({ 
                    success: false, 
                    message: 'Profesor no encontrado' 
                });
            }
            
            res.json({ 
                success: true, 
                profesor: result[0]
            });
        });
    },
    
    // Actualizar profesor
    actualizar: (req, res) => {
        const { numero_de_control, nombre, especialidad } = req.body;
        
        if (!numero_de_control || !nombre || !especialidad) {
            return res.json({ 
                success: false, 
                message: 'Todos los campos son obligatorios' 
            });
        }
        
        // Primero verificamos que el profesor exista
        const checkSql = 'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?';
        
        pool.query(checkSql, [numero_de_control], (err, result) => {
            if (err) {
                console.error('Error verificando profesor:', err);
                return res.json({ 
                    success: false, 
                    message: 'Error en la base de datos' 
                });
            }
            
            if (result.length === 0) {
                return res.json({ 
                    success: false, 
                    message: 'Profesor no encontrado' 
                });
            }
            
            // Actualizamos el profesor
            const updateSql = 'UPDATE profesores SET nombre = ?, especialidad = ? WHERE numero_de_control = ?';
            
            pool.query(updateSql, [nombre, especialidad, numero_de_control], (err, result) => {
                if (err) {
                    console.error('Error actualizando profesor:', err);
                    return res.json({ 
                        success: false, 
                        message: 'Error en la base de datos' 
                    });
                }
                
                res.json({ 
                    success: true, 
                    message: 'Profesor actualizado correctamente' 
                });
            });
        });
    },
    
    // Eliminar profesor (con backup en tabla eliminados)
    eliminar: (req, res) => {
        const { numero_de_control } = req.body;
        
        if (!numero_de_control) {
            return res.json({ 
                success: false, 
                message: 'Debe proporcionar un número de control' 
            });
        }
        
        // Primero obtenemos los datos del profesor
        const getSql = 'SELECT numero_de_control, nombre, especialidad FROM profesores WHERE numero_de_control = ?';
        
        pool.query(getSql, [numero_de_control], (err, result) => {
            if (err) {
                console.error('Error obteniendo profesor:', err);
                return res.json({ 
                    success: false, 
                    message: 'Error en la base de datos' 
                });
            }
            
            if (result.length === 0) {
                return res.json({ 
                    success: false, 
                    message: 'Profesor no encontrado' 
                });
            }
            
            const profesor = result[0];
            
            // Insertamos en la tabla de eliminados
            const insertEliminadoSql = 'INSERT INTO profesores_eliminados (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
            
            pool.query(insertEliminadoSql, [profesor.numero_de_control, profesor.nombre, profesor.especialidad], (err) => {
                if (err) {
                    console.error('Error guardando backup:', err);
                    // Continuamos aunque falle el backup
                }
                
                // Eliminamos de la tabla principal
                const deleteSql = 'DELETE FROM profesores WHERE numero_de_control = ?';
                
                pool.query(deleteSql, [numero_de_control], (err, result) => {
                    if (err) {
                        console.error('Error eliminando profesor:', err);
                        return res.json({ 
                            success: false, 
                            message: 'Error en la base de datos' 
                        });
                    }
                    
                    res.json({ 
                        success: true, 
                        message: 'Profesor eliminado correctamente' 
                    });
                });
            });
        });
    },
    
    // Listar todos los profesores
    listar: (req, res) => {
        const sql = 'SELECT numero_de_control, nombre, especialidad FROM profesores ORDER BY nombre ASC';
        
        pool.query(sql, (err, result) => {
            if (err) {
                console.error('Error listando profesores:', err);
                return res.json({ 
                    success: false, 
                    message: 'Error en la base de datos al listar profesores' 
                });
            }
            
            res.json({ 
                success: true, 
                profesores: result,
                total: result.length
            });
        });
    }
};

module.exports = profesoresController;