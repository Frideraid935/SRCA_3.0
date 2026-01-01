// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // Registrar nueva materia
    registrarMateria: (req, res) => {
        try {
            const { nombre } = req.body;
            
            if (!nombre || nombre.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "El nombre de la materia es requerido" 
                });
            }
            
            const query = "INSERT INTO materias (nombre) VALUES (?)";
            
            db.query(query, [nombre.trim()], (err, result) => {
                if (err) {
                    console.error("Error en base de datos:", err);
                    return res.json({ 
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
            
        } catch (error) {
            console.error("Error en registrarMateria:", error);
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Listar todas las materias
    listarMaterias: (req, res) => {
        try {
            const query = "SELECT id, nombre FROM materias ORDER BY id DESC";
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error en base de datos:", err);
                    return res.json({ 
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
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Buscar materia por ID (para eliminar por nombre)
    buscarMateriaPorId: (req, res) => {
        try {
            const materiaId = req.params.id;
            
            if (!materiaId) {
                return res.json({ 
                    success: false, 
                    message: "ID de materia es requerido" 
                });
            }
            
            const query = "SELECT id, nombre FROM materias WHERE id = ?";
            
            db.query(query, [materiaId], (err, results) => {
                if (err) {
                    console.error("Error en base de datos:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al buscar la materia" 
                    });
                }
                
                if (results.length === 0) {
                    return res.json({ 
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
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Buscar materias por nombre (nuevo método)
    buscarMateriasPorNombre: (req, res) => {
        try {
            const nombre = req.params.nombre;
            
            if (!nombre || nombre.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "Nombre de materia es requerido" 
                });
            }
            
            const searchTerm = `%${nombre}%`;
            const query = "SELECT id, nombre FROM materias WHERE nombre LIKE ? ORDER BY nombre";
            
            db.query(query, [searchTerm], (err, results) => {
                if (err) {
                    console.error("Error en base de datos:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al buscar materias" 
                    });
                }
                
                res.json({
                    success: true,
                    materias: results,
                    count: results.length
                });
            });
            
        } catch (error) {
            console.error("Error en buscarMateriasPorNombre:", error);
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Eliminar materia
    eliminarMateria: (req, res) => {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.json({ 
                    success: false, 
                    message: "ID de materia es requerido" 
                });
            }
            
            const query = "DELETE FROM materias WHERE id = ?";
            
            db.query(query, [id], (err, result) => {
                if (err) {
                    console.error("Error en base de datos:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al eliminar la materia" 
                    });
                }
                
                if (result.affectedRows === 0) {
                    return res.json({ 
                        success: false, 
                        message: "Materia no encontrada" 
                    });
                }
                
                res.json({
                    success: true,
                    message: "Materia eliminada exitosamente"
                });
            });
            
        } catch (error) {
            console.error("Error en eliminarMateria:", error);
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    }
};

module.exports = materiasController;