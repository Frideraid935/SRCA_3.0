// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // 1. REGISTRAR materia
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
                    console.error("Error:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al registrar" 
                    });
                }
                
                res.json({
                    success: true,
                    message: "Materia registrada",
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

    // 2. ELIMINAR materia por NOMBRE (DIRECTO)
    eliminarMateriaPorNombre: function(req, res) {
        try {
            const { nombre } = req.body;
            
            console.log("Eliminando materia por nombre:", nombre);
            
            if (!nombre || nombre.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "El nombre es requerido" 
                });
            }
            
            const query = "DELETE FROM materias WHERE nombre = ?";
            
            db.query(query, [nombre.trim()], (err, result) => {
                if (err) {
                    console.error("Error:", err);
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
                    message: "Materia eliminada exitosamente",
                    affectedRows: result.affectedRows
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