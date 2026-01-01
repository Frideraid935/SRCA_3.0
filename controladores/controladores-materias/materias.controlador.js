// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // 1. REGISTRAR materia
    registrarMateria: function(req, res) {
        try {
            const { nombre } = req.body;
            
            console.log('📝 Registrando materia:', nombre);
            
            // Validación simple
            if (!nombre || nombre.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "El nombre de la materia es requerido" 
                });
            }
            
            const query = "INSERT INTO materias (nombre) VALUES (?)";
            const nombreLimpio = nombre.trim();
            
            db.query(query, [nombreLimpio], (err, result) => {
                if (err) {
                    console.error('❌ Error SQL:', err);
                    
                    // Manejar error de duplicado
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.json({ 
                            success: false, 
                            message: "Esta materia ya existe" 
                        });
                    }
                    
                    return res.json({ 
                        success: false, 
                        message: "Error al guardar en la base de datos" 
                    });
                }
                
                console.log('✅ Materia registrada. ID:', result.insertId);
                
                res.json({
                    success: true,
                    message: "Materia registrada exitosamente",
                    id: result.insertId
                });
            });
            
        } catch (error) {
            console.error('❌ Error general:', error);
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // 2. BUSCAR materia por nombre (para eliminar)
    buscarMateriaParaEliminar: function(req, res) {
        try {
            const { nombre } = req.query;
            
            console.log('🔍 Buscando materia para eliminar:', nombre);
            
            if (!nombre || nombre.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "Debes escribir un nombre para buscar" 
                });
            }
            
            const query = "SELECT id, nombre FROM materias WHERE nombre LIKE ? LIMIT 1";
            const searchTerm = `%${nombre.trim()}%`;
            
            db.query(query, [searchTerm], (err, results) => {
                if (err) {
                    console.error('❌ Error SQL:', err);
                    return res.json({ 
                        success: false, 
                        message: "Error al buscar en la base de datos" 
                    });
                }
                
                if (results.length === 0) {
                    return res.json({ 
                        success: false, 
                        message: "Materia no encontrada. Verifica el nombre." 
                    });
                }
                
                console.log('✅ Materia encontrada:', results[0]);
                
                res.json({
                    success: true,
                    message: "Materia encontrada",
                    materia: results[0]
                });
            });
            
        } catch (error) {
            console.error('❌ Error general:', error);
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // 3. ELIMINAR materia
    eliminarMateria: function(req, res) {
        try {
            const { id } = req.body;
            
            console.log('🗑️ Eliminando materia ID:', id);
            
            if (!id || isNaN(id)) {
                return res.json({ 
                    success: false, 
                    message: "ID de materia inválido" 
                });
            }
            
            const query = "DELETE FROM materias WHERE id = ?";
            
            db.query(query, [parseInt(id)], (err, result) => {
                if (err) {
                    console.error('❌ Error SQL:', err);
                    return res.json({ 
                        success: false, 
                        message: "Error al eliminar de la base de datos" 
                    });
                }
                
                if (result.affectedRows === 0) {
                    return res.json({ 
                        success: false, 
                        message: "La materia ya fue eliminada o no existe" 
                    });
                }
                
                console.log('✅ Materia eliminada. Filas afectadas:', result.affectedRows);
                
                res.json({
                    success: true,
                    message: "Materia eliminada exitosamente"
                });
            });
            
        } catch (error) {
            console.error('❌ Error general:', error);
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    }
};

module.exports = materiasController;