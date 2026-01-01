// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // REGISTRAR materia
    registrarMateria: function(req, res) {
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
                    console.error("Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al registrar en la base de datos" 
                    });
                }
                
                res.json({
                    success: true,
                    message: "Materia registrada exitosamente",
                    id: result.insertId
                });
            });
            
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // BUSCAR materia por nombre
    buscarMateria: function(req, res) {
        try {
            const nombre = req.query.nombre || '';
            
            if (!nombre || nombre.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "Debe escribir un nombre para buscar" 
                });
            }
            
            const query = "SELECT id, nombre FROM materias WHERE nombre LIKE ? LIMIT 1";
            const searchTerm = `%${nombre.trim()}%`;
            
            db.query(query, [searchTerm], (err, results) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error en la base de datos" 
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
                    message: "Materia encontrada",
                    materia: results[0]
                });
            });
            
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // ELIMINAR materia por ID
    eliminarMateria: function(req, res) {
        try {
            const { id } = req.body;
            
            if (!id || isNaN(id)) {
                return res.json({ 
                    success: false, 
                    message: "ID de materia invalido" 
                });
            }
            
            const query = "DELETE FROM materias WHERE id = ?";
            
            db.query(query, [parseInt(id)], (err, result) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error al eliminar de la base de datos" 
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
            console.error("Error:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    }
};

module.exports = materiasController;