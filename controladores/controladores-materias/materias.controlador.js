const db = require("../../BD/BD.js");

const materiasController = {
    // 1. REGISTRAR materia
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
                        message: "Error al registrar" 
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
                message: "Error interno" 
            });
        }
    },

    // 2. ELIMINAR materia por NOMBRE
    eliminarMateriaPorNombre: function(req, res) {
        try {
            const { nombre } = req.body;
            
            if (!nombre || nombre.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "El nombre de la materia es requerido" 
                });
            }
            
            const query = "DELETE FROM materias WHERE nombre = ?";
            
            db.query(query, [nombre.trim()], (err, result) => {
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
                        message: "No se encontró ninguna materia con ese nombre" 
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
            res.status(500).json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    },

    // 3. LISTAR todas las materias (NECESARIO para tu formulario)
    listarMaterias: function(req, res) {
        try {
            const query = "SELECT id, nombre FROM materias ORDER BY nombre ASC";
            db.query(query, (err, rows) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error al obtener materias" 
                    });
                }
                res.json(rows);
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    }
};

module.exports = materiasController;
