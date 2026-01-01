// controladores/controladores-materias/materias.controlador.js
const db = require("../../BD/BD.js");

const materiasController = {
    // Registrar nueva materia
    registrarMateria: (req, res) => {
        console.log('=== REGISTRAR MATERIA ===');
        console.log('Datos recibidos:', req.body);
        
        try {
            const { nombre } = req.body;
            
            if (!nombre || nombre.trim() === '') {
                console.log('Error: Nombre vacío');
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
                        message: "Error al registrar materia" 
                    });
                }
                
                console.log('✅ Materia registrada, ID:', result.insertId);
                
                res.json({
                    success: true,
                    message: "Materia registrada exitosamente",
                    id: result.insertId
                });
            });
            
        } catch (error) {
            console.error("Error general:", error);
            res.json({ 
                success: false, 
                message: "Error interno del servidor" 
            });
        }
    },

    // Listar todas las materias
    listarMaterias: (req, res) => {
        try {
            console.log('Listando materias...');
            
            const query = "SELECT id, nombre FROM materias ORDER BY nombre ASC";
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al listar materias" 
                    });
                }
                
                res.json({
                    success: true,
                    materias: results
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

    // Buscar materias por nombre
    buscarMateriasPorNombre: (req, res) => {
        console.log('=== BUSCAR MATERIAS ===');
        console.log('Query params:', req.query);
        
        try {
            const nombre = req.query.nombre || '';
            
            if (!nombre || nombre.trim().length < 2) {
                return res.json({ 
                    success: true,
                    materias: [],
                    count: 0,
                    message: "Escribe al menos 2 caracteres"
                });
            }
            
            const query = "SELECT id, nombre FROM materias WHERE LOWER(nombre) LIKE LOWER(?) ORDER BY nombre LIMIT 10";
            const searchTerm = `%${nombre.trim()}%`;
            
            console.log('Buscando:', searchTerm);
            
            db.query(query, [searchTerm], (err, results) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error en la búsqueda" 
                    });
                }
                
                console.log(`✅ Encontradas ${results.length} materias`);
                
                res.json({
                    success: true,
                    materias: results,
                    count: results.length
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

    // Eliminar materia
    eliminarMateria: (req, res) => {
        console.log('=== ELIMINAR MATERIA ===');
        console.log('Datos:', req.body);
        
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
                
                console.log(`✅ Materia ${id} eliminada`);
                
                res.json({
                    success: true,
                    message: "Materia eliminada exitosamente"
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
    
    // NOTA: Quité obtenerMateriaPorId porque no la necesitas en el nuevo flujo
};

module.exports = materiasController;