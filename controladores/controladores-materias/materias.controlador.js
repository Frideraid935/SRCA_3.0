// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // Registrar nueva materia
    registrarMateria: (req, res) => {
        try {
            const { nombre } = req.body;
            
            console.log('Intentando registrar materia:', nombre);
            
            if (!nombre || nombre.trim() === '') {
                return res.status(400).json({ 
                    success: false, 
                    message: "El nombre de la materia es requerido" 
                });
            }
            
            const query = "INSERT INTO materias (nombre) VALUES (?)";
            
            db.query(query, [nombre.trim()], (err, result) => {
                if (err) {
                    console.error("Error SQL al registrar:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error en la base de datos al registrar" 
                    });
                }
                
                console.log('Materia registrada, ID:', result.insertId);
                
                res.json({
                    success: true,
                    message: "Materia registrada exitosamente",
                    id: result.insertId
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
            console.log('Listando todas las materias');
            
            const query = "SELECT id, nombre FROM materias ORDER BY id DESC";
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error SQL al listar:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error en la base de datos al listar" 
                    });
                }
                
                console.log('Materias encontradas:', results.length);
                
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

    // Eliminar materia
    eliminarMateria: (req, res) => {
        try {
            const { id } = req.body;
            
            console.log('Intentando eliminar materia ID:', id);
            
            if (!id) {
                return res.status(400).json({ 
                    success: false, 
                    message: "ID de materia es requerido" 
                });
            }
            
            const query = "DELETE FROM materias WHERE id = ?";
            
            db.query(query, [id], (err, result) => {
                if (err) {
                    console.error("Error SQL al eliminar:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error en la base de datos al eliminar" 
                    });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: "Materia no encontrada" 
                    });
                }
                
                console.log('Materia eliminada, filas afectadas:', result.affectedRows);
                
                res.json({
                    success: true,
                    message: "Materia eliminada exitosamente"
                });
            });
            
        } catch (error) {
            console.error("Error en eliminarMateria:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    }
};

module.exports = materiasController;