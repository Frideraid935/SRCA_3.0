// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // 1. Registrar materia
    registrarMateria: function(req, res) {
        try {
            console.log('📝 Registrando materia...');
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
                    console.error("❌ Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al registrar" 
                    });
                }
                
                console.log('✅ Materia registrada ID:', result.insertId);
                
                res.json({
                    success: true,
                    message: "Materia registrada exitosamente",
                    id: result.insertId
                });
            });
            
        } catch (error) {
            console.error("❌ Error:", error);
            res.json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    },

    // 2. Listar todas las materias
    listarMaterias: function(req, res) {
        try {
            console.log('📋 Listando materias...');
            
            const query = "SELECT id, nombre FROM materias ORDER BY nombre ASC";
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("❌ Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al listar" 
                    });
                }
                
                console.log(`✅ ${results.length} materias encontradas`);
                
                res.json({
                    success: true,
                    materias: results
                });
            });
            
        } catch (error) {
            console.error("❌ Error:", error);
            res.json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    },

    // 3. Buscar materias por nombre (PARA ELIMINAR)
    buscarMateriasPorNombre: function(req, res) {
        try {
            const nombre = req.query.nombre || '';
            console.log('🔍 Buscando materias con:', nombre);
            
            if (!nombre || nombre.trim().length < 2) {
                return res.json({ 
                    success: true,
                    materias: [],
                    message: "Escribe al menos 2 caracteres"
                });
            }
            
            const query = "SELECT id, nombre FROM materias WHERE nombre LIKE ? ORDER BY nombre LIMIT 10";
            const searchTerm = `%${nombre.trim()}%`;
            
            db.query(query, [searchTerm], (err, results) => {
                if (err) {
                    console.error("❌ Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error en búsqueda" 
                    });
                }
                
                console.log(`✅ ${results.length} resultados`);
                
                res.json({
                    success: true,
                    materias: results,
                    count: results.length
                });
            });
            
        } catch (error) {
            console.error("❌ Error:", error);
            res.json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    },

    // 4. Obtener materia por ID (ESTA ES LA FUNCIÓN QUE FALTABA)
    obtenerMateriaPorId: function(req, res) {
        try {
            const { id } = req.params;
            console.log('🔎 Buscando materia ID:', id);
            
            if (!id || isNaN(id)) {
                return res.json({ 
                    success: false, 
                    message: "ID inválido" 
                });
            }
            
            const query = "SELECT id, nombre FROM materias WHERE id = ?";
            
            db.query(query, [id], (err, results) => {
                if (err) {
                    console.error("❌ Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al buscar" 
                    });
                }
                
                if (results.length === 0) {
                    return res.json({ 
                        success: false, 
                        message: "Materia no encontrada" 
                    });
                }
                
                console.log('✅ Materia encontrada:', results[0]);
                
                res.json({
                    success: true,
                    materia: results[0]
                });
            });
            
        } catch (error) {
            console.error("❌ Error:", error);
            res.json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    },

    // 5. Eliminar materia
    eliminarMateria: function(req, res) {
        try {
            const { id } = req.body;
            console.log('🗑️ Eliminando materia ID:', id);
            
            if (!id || isNaN(id)) {
                return res.json({ 
                    success: false, 
                    message: "ID inválido" 
                });
            }
            
            const query = "DELETE FROM materias WHERE id = ?";
            
            db.query(query, [id], (err, result) => {
                if (err) {
                    console.error("❌ Error SQL:", err);
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
                
                console.log('✅ Materia eliminada');
                
                res.json({
                    success: true,
                    message: "Materia eliminada exitosamente"
                });
            });
            
        } catch (error) {
            console.error("❌ Error:", error);
            res.json({ 
                success: false, 
                message: "Error interno" 
            });
        }
    }
};

module.exports = materiasController;