// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // Registrar nueva materia
    registrarMateria: (req, res) => {
        try {
            const { codigo, nombre, descripcion, creditos, horas_semana, id_profesor } = req.body;
            
            if (!codigo || !nombre) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Código y nombre son campos requeridos" 
                });
            }
            
            const verificarQuery = "SELECT id FROM materias WHERE codigo = ? AND estado = 'activo'";
            db.query(verificarQuery, [codigo], (err, results) => {
                if (err) {
                    console.error("Error al verificar código:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error del servidor" 
                    });
                }
                
                if (results.length > 0) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "El código de materia ya existe" 
                    });
                }
                
                const insertQuery = `
                    INSERT INTO materias (codigo, nombre, descripcion, creditos, horas_semana, id_profesor, estado, fecha_creacion) 
                    VALUES (?, ?, ?, ?, ?, ?, 'activo', NOW())
                `;
                
                const values = [codigo, nombre, descripcion || null, creditos || 0, horas_semana || 0, id_profesor || null];
                
                db.query(insertQuery, values, (err, result) => {
                    if (err) {
                        console.error("Error al registrar materia:", err);
                        return res.status(500).json({ 
                            success: false, 
                            message: "Error al registrar la materia" 
                        });
                    }
                    
                    res.json({
                        success: true,
                        message: "Materia registrada exitosamente",
                        id: result.insertId
                    });
                });
            });
            
        } catch (error) {
            console.error("Error en registrarMateria:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Listar todas las materias
    listarMaterias: (req, res) => {
        try {
            const query = `
                SELECT m.*, 
                       CONCAT(u.nombre, ' ', u.apellido) as profesor_nombre,
                       u.email as profesor_email
                FROM materias m
                LEFT JOIN profesores p ON m.id_profesor = p.id
                LEFT JOIN usuarios u ON p.id_usuario = u.id
                WHERE m.estado = 'activo'
                ORDER BY m.nombre ASC
            `;
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error al listar materias:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error al obtener las materias" 
                    });
                }
                
                res.json({
                    success: true,
                    materias: results
                });
            });
            
        } catch (error) {
            console.error("Error en listarMaterias:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Buscar materia por ID
    buscarMateriaPorId: (req, res) => {
        try {
            const materiaId = req.params.id;
            
            if (!materiaId) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID de materia es requerido" 
                });
            }
            
            const query = `
                SELECT m.*, 
                       CONCAT(u.nombre, ' ', u.apellido) as profesor_nombre,
                       u.email as profesor_email
                FROM materias m
                LEFT JOIN profesores p ON m.id_profesor = p.id
                LEFT JOIN usuarios u ON p.id_usuario = u.id
                WHERE m.id = ? AND m.estado = 'activo'
            `;
            
            db.query(query, [materiaId], (err, results) => {
                if (err) {
                    console.error("Error al buscar materia:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error al buscar la materia" 
                    });
                }
                
                if (results.length === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: "Materia no encontrada" 
                    });
                }
                
                res.json({
                    success: true,
                    materia: results[0]
                });
            });
            
        } catch (error) {
            console.error("Error en buscarMateriaPorId:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Actualizar materia (NUEVO ENDPOINT)
    actualizarMateria: (req, res) => {
        try {
            const { id, codigo, nombre, descripcion, creditos, horas_semana, id_profesor, estado } = req.body;
            
            if (!id || !codigo || !nombre) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID, código y nombre son campos requeridos" 
                });
            }
            
            // Verificar si el código ya existe en otra materia
            const verificarQuery = "SELECT id FROM materias WHERE codigo = ? AND id != ? AND estado = 'activo'";
            db.query(verificarQuery, [codigo, id], (err, results) => {
                if (err) {
                    console.error("Error al verificar código:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error del servidor" 
                    });
                }
                
                if (results.length > 0) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "El código de materia ya existe en otra materia" 
                    });
                }
                
                const updateQuery = `
                    UPDATE materias 
                    SET codigo = ?, nombre = ?, descripcion = ?, 
                        creditos = ?, horas_semana = ?, id_profesor = ?, estado = ?, 
                        fecha_actualizacion = NOW()
                    WHERE id = ? AND estado = 'activo'
                `;
                
                const values = [codigo, nombre, descripcion || null, creditos || 0, 
                               horas_semana || 0, id_profesor || null, estado || 'activo', id];
                
                db.query(updateQuery, values, (err, result) => {
                    if (err) {
                        console.error("Error al actualizar materia:", err);
                        return res.status(500).json({ 
                            success: false, 
                            message: "Error al actualizar la materia" 
                        });
                    }
                    
                    if (result.affectedRows === 0) {
                        return res.status(404).json({ 
                            success: false, 
                            message: "Materia no encontrada o no se pudo actualizar" 
                        });
                    }
                    
                    res.json({
                        success: true,
                        message: "Materia actualizada exitosamente"
                    });
                });
            });
            
        } catch (error) {
            console.error("Error en actualizarMateria:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Eliminar materia (cambiar estado a inactivo)
    eliminarMateria: (req, res) => {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID de materia es requerido" 
                });
            }
            
            const verificarInscripcionesQuery = `
                SELECT COUNT(*) as total FROM inscripciones 
                WHERE id_materia = ? AND estado = 'activo'
            `;
            
            db.query(verificarInscripcionesQuery, [id], (err, results) => {
                if (err) {
                    console.error("Error al verificar inscripciones:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error del servidor" 
                    });
                }
                
                if (results[0].total > 0) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "No se puede eliminar la materia porque tiene alumnos inscritos" 
                    });
                }
                
                const deleteQuery = `
                    UPDATE materias 
                    SET estado = 'inactivo', fecha_eliminacion = NOW() 
                    WHERE id = ?
                `;
                
                db.query(deleteQuery, [id], (err, result) => {
                    if (err) {
                        console.error("Error al eliminar materia:", err);
                        return res.status(500).json({ 
                            success: false, 
                            message: "Error al eliminar la materia" 
                        });
                    }
                    
                    if (result.affectedRows === 0) {
                        return res.status(404).json({ 
                            success: false, 
                            message: "Materia no encontrada" 
                        });
                    }
                    
                    res.json({
                        success: true,
                        message: "Materia eliminada exitosamente"
                    });
                });
            });
            
        } catch (error) {
            console.error("Error en eliminarMateria:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Buscar materias por término (NUEVO ENDPOINT)
    buscarMateriaPorTermino: (req, res) => {
        try {
            const termino = req.params.termino;
            
            if (!termino || termino.trim() === '') {
                return res.status(400).json({ 
                    success: false, 
                    message: "Término de búsqueda es requerido" 
                });
            }
            
            const searchTerm = `%${termino}%`;
            
            const query = `
                SELECT m.*, 
                       CONCAT(u.nombre, ' ', u.apellido) as profesor_nombre,
                       u.email as profesor_email
                FROM materias m
                LEFT JOIN profesores p ON m.id_profesor = p.id
                LEFT JOIN usuarios u ON p.id_usuario = u.id
                WHERE (m.codigo LIKE ? OR m.nombre LIKE ? OR m.descripcion LIKE ?) 
                AND m.estado = 'activo'
                ORDER BY m.nombre ASC
                LIMIT 50
            `;
            
            db.query(query, [searchTerm, searchTerm, searchTerm], (err, results) => {
                if (err) {
                    console.error("Error al buscar materias:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error al buscar materias" 
                    });
                }
                
                res.json({
                    success: true,
                    materias: results
                });
            });
            
        } catch (error) {
            console.error("Error en buscarMateriaPorTermino:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Obtener profesores para selector (NUEVO ENDPOINT)
    obtenerProfesoresParaSelector: (req, res) => {
        try {
            const query = `
                SELECT p.id, 
                       CONCAT(u.nombre, ' ', u.apellido) as nombre_completo,
                       u.email,
                       u.username
                FROM profesores p
                JOIN usuarios u ON p.id_usuario = u.id
                WHERE u.estado = 'activo' AND p.estado = 'activo'
                ORDER BY u.nombre ASC
            `;
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error al obtener profesores:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error al obtener la lista de profesores" 
                    });
                }
                
                res.json({
                    success: true,
                    profesores: results
                });
            });
            
        } catch (error) {
            console.error("Error en obtenerProfesoresParaSelector:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Obtener materias por profesor (NUEVO ENDPOINT - opcional)
    obtenerMateriasPorProfesor: (req, res) => {
        try {
            const profesorId = req.params.profesorId;
            
            if (!profesorId) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID de profesor es requerido" 
                });
            }
            
            const query = `
                SELECT m.*
                FROM materias m
                WHERE m.id_profesor = ? AND m.estado = 'activo'
                ORDER BY m.nombre ASC
            `;
            
            db.query(query, [profesorId], (err, results) => {
                if (err) {
                    console.error("Error al obtener materias por profesor:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error al obtener materias" 
                    });
                }
                
                res.json({
                    success: true,
                    materias: results
                });
            });
            
        } catch (error) {
            console.error("Error en obtenerMateriasPorProfesor:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Verificar si materia existe por código (NUEVO ENDPOINT - opcional)
    verificarCodigoMateria: (req, res) => {
        try {
            const codigo = req.params.codigo;
            
            if (!codigo) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Código de materia es requerido" 
                });
            }
            
            const query = "SELECT id, nombre FROM materias WHERE codigo = ? AND estado = 'activo'";
            
            db.query(query, [codigo], (err, results) => {
                if (err) {
                    console.error("Error al verificar código:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error del servidor" 
                    });
                }
                
                if (results.length > 0) {
                    return res.json({
                        success: false,
                        message: "El código de materia ya existe",
                        materia: results[0]
                    });
                }
                
                res.json({
                    success: true,
                    message: "Código disponible"
                });
            });
            
        } catch (error) {
            console.error("Error en verificarCodigoMateria:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Obtener estadísticas de materias (NUEVO ENDPOINT - opcional)
    obtenerEstadisticasMaterias: (req, res) => {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_materias,
                    COUNT(CASE WHEN id_profesor IS NOT NULL THEN 1 END) as materias_asignadas,
                    COUNT(CASE WHEN id_profesor IS NULL THEN 1 END) as materias_sin_asignar,
                    AVG(creditos) as promedio_creditos,
                    AVG(horas_semana) as promedio_horas
                FROM materias 
                WHERE estado = 'activo'
            `;
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error al obtener estadísticas:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error al obtener estadísticas" 
                    });
                }
                
                res.json({
                    success: true,
                    estadisticas: results[0] || {}
                });
            });
            
        } catch (error) {
            console.error("Error en obtenerEstadisticasMaterias:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    }
};

module.exports = materiasController;