// profesores.controlador.js
const pool = require("../../BD/BD.js");

const profesoresController = {
    // Registrar profesor
    registrar: async (req, res) => {
        try {
            const { numero_de_control, nombre, especialidad } = req.body;
            
            if (!numero_de_control || !nombre || !especialidad) {
                return res.json({ 
                    success: false, 
                    message: 'Todos los campos son obligatorios' 
                });
            }
            
            if (numero_de_control.length !== 8) {
                return res.json({ 
                    success: false, 
                    message: 'El número de control debe tener 8 caracteres' 
                });
            }
            
            // Verificar si ya existe
            const [existing] = await pool.query(
                'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?',
                [numero_de_control]
            );
            
            if (existing.length > 0) {
                return res.json({ 
                    success: false, 
                    message: 'Ya existe un profesor con este número de control' 
                });
            }
            
            // Insertar nuevo profesor
            const [result] = await pool.query(
                'INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)',
                [numero_de_control, nombre, especialidad]
            );
            
            res.json({ 
                success: true, 
                message: 'Profesor registrado correctamente',
                id: result.insertId
            });
            
        } catch (error) {
            console.error('Error registrando profesor:', error);
            return res.json({ 
                success: false, 
                message: 'Error en la base de datos: ' + error.message 
            });
        }
    },
    
    // Buscar profesor
    buscar: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.json({ 
                    success: false, 
                    message: 'Debe proporcionar un número de control' 
                });
            }
            
            const [result] = await pool.query(
                'SELECT numero_de_control, nombre, especialidad FROM profesores WHERE numero_de_control = ?',
                [id]
            );
            
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
            
        } catch (error) {
            console.error('Error buscando profesor:', error);
            return res.json({ 
                success: false, 
                message: 'Error en la base de datos: ' + error.message 
            });
        }
    },
    
    // Actualizar profesor
    actualizar: async (req, res) => {
        try {
            const { numero_de_control, nombre, especialidad } = req.body;
            
            if (!numero_de_control || !nombre || !especialidad) {
                return res.json({ 
                    success: false, 
                    message: 'Todos los campos son obligatorios' 
                });
            }
            
            // Verificar que el profesor exista
            const [existing] = await pool.query(
                'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?',
                [numero_de_control]
            );
            
            if (existing.length === 0) {
                return res.json({ 
                    success: false, 
                    message: 'Profesor no encontrado' 
                });
            }
            
            // Actualizar profesor
            const [result] = await pool.query(
                'UPDATE profesores SET nombre = ?, especialidad = ? WHERE numero_de_control = ?',
                [nombre, especialidad, numero_de_control]
            );
            
            res.json({ 
                success: true, 
                message: 'Profesor actualizado correctamente' 
            });
            
        } catch (error) {
            console.error('Error actualizando profesor:', error);
            return res.json({ 
                success: false, 
                message: 'Error en la base de datos: ' + error.message 
            });
        }
    },
    
    // Eliminar profesor (con backup en tabla eliminados)
    eliminar: async (req, res) => {
        try {
            const { numero_de_control } = req.body;
            
            if (!numero_de_control) {
                return res.json({ 
                    success: false, 
                    message: 'Debe proporcionar un número de control' 
                });
            }
            
            // Obtener datos del profesor
            const [profesorData] = await pool.query(
                'SELECT numero_de_control, nombre, especialidad FROM profesores WHERE numero_de_control = ?',
                [numero_de_control]
            );
            
            if (profesorData.length === 0) {
                return res.json({ 
                    success: false, 
                    message: 'Profesor no encontrado' 
                });
            }
            
            const profesor = profesorData[0];
            
            // Insertar en tabla de eliminados (si existe)
            try {
                await pool.query(
                    'INSERT INTO profesores_eliminados (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)',
                    [profesor.numero_de_control, profesor.nombre, profesor.especialidad]
                );
            } catch (backupError) {
                console.warn('Error guardando backup (puede ignorarse):', backupError.message);
                // Continuamos aunque falle el backup
            }
            
            // Eliminar de la tabla principal
            const [result] = await pool.query(
                'DELETE FROM profesores WHERE numero_de_control = ?',
                [numero_de_control]
            );
            
            res.json({ 
                success: true, 
                message: 'Profesor eliminado correctamente' 
            });
            
        } catch (error) {
            console.error('Error eliminando profesor:', error);
            return res.json({ 
                success: false, 
                message: 'Error en la base de datos: ' + error.message 
            });
        }
    },
    
    // Listar todos los profesores
    listar: async (req, res) => {
        try {
            const [result] = await pool.query(
                'SELECT numero_de_control, nombre, especialidad FROM profesores ORDER BY nombre ASC'
            );
            
            res.json({ 
                success: true, 
                profesores: result,
                total: result.length
            });
            
        } catch (error) {
            console.error('Error listando profesores:', error);
            return res.json({ 
                success: false, 
                message: 'Error en la base de datos al listar profesores: ' + error.message 
            });
        }
    }
};

module.exports = profesoresController;