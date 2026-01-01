// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // Registrar nueva materia (SIMPLIFICADO)
    registrarMateria: (req, res) => {
        try {
            const { nombre } = req.body; // SOLO nombre si es lo único que tienes
            
            if (!nombre) {
                return res.json({ 
                    success: false, 
                    message: "El nombre es requerido" 
                });
            }
            
            // Consulta SIMPLE para tu tabla
            const insertQuery = `
                INSERT INTO materias (nombre, estado) 
                VALUES (?, 'activo')
            `;
            
            db.query(insertQuery, [nombre], (err, result) => {
                if (err) {
                    console.error("Error al registrar materia:", err);
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

    // Listar todas las materias (SIMPLIFICADO)
    listarMaterias: (req, res) => {
        try {
            const query = `
                SELECT id, nombre, estado 
                FROM materias 
                WHERE estado = 'activo'
                ORDER BY nombre ASC
            `;
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error al listar materias:", err);
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

    // Eliminar materia (SIMPLIFICADO)
    eliminarMateria: (req, res) => {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.json({ 
                    success: false, 
                    message: "ID de materia es requerido" 
                });
            }
            
            const deleteQuery = `
                UPDATE materias 
                SET estado = 'inactivo'
                WHERE id = ?
            `;
            
            db.query(deleteQuery, [id], (err, result) => {
                if (err) {
                    console.error("Error al eliminar materia:", err);
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