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
                    message: "El nombre es requerido" 
                });
            }
            
            const query = "INSERT INTO materias (nombre) VALUES (?)";
            
            db.query(query, [nombre.trim()], (err, result) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al registrar" 
                    });
                }
                
                res.json({
                    success: true,
                    message: "✅ Materia registrada exitosamente",
                    id: result.insertId
                });
            });
            
        } catch (error) {
            console.error("Error:", error);
            res.json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    },

    // BUSCAR materia por nombre (PARA ELIMINAR)
    buscarMateriaParaEliminar: function(req, res) {
        try {
            const { nombre } = req.query;
            
            if (!nombre || nombre.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "Escribe el nombre de la materia" 
                });
            }
            
            const query = "SELECT id, nombre FROM materias WHERE nombre LIKE ? LIMIT 1";
            const searchTerm = `%${nombre.trim()}%`;
            
            db.query(query, [searchTerm], (err, results) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error en la búsqueda" 
                    });
                }
                
                if (results.length === 0) {
                    return res.json({ 
                        success: false, 
                        message: "❌ Materia no encontrada" 
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
            res.json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    },

    // ELIMINAR materia
    eliminarMateria: function(req, res) {
        try {
            const { id } = req.body;
            
            if (!id || isNaN(id)) {
                return res.json({ 
                    success: false, 
                    message: "ID inválido" 
                });
            }
            
            const query = "DELETE FROM materias WHERE id = ?";
            
            db.query(query, [id], (err, result) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al eliminar" 
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
                    message: "✅ Materia eliminada exitosamente"
                });
            });
            
        } catch (error) {
            console.error("Error:", error);
            res.json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    }
};

module.exports = materiasController;