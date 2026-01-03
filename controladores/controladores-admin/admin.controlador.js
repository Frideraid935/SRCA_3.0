// controladores/controladores-admin/admin.controlador.js
const db = require("../../BD/BD.js");

const adminController = {
    registrarAdmin: function(req, res) {
        try {
            const { usuario, contrasena } = req.body;
            
            if (!usuario || !contrasena) {
                return res.json({ 
                    success: false, 
                    message: "Usuario y contraseña son requeridos" 
                });
            }
            
            const query = "INSERT INTO administradores (usuario, contrasena) VALUES (?, ?)";
            
            db.query(query, [usuario.trim(), contrasena.trim()], (err, result) => {
                if (err) {
                    console.error("Error:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error al registrar" 
                    });
                }
                
                res.json({
                    success: true,
                    message: "Administrador registrado exitosamente"
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

    buscarAdmin: function(req, res) {
        try {
            const usuario = req.query.usuario || '';
            
            if (!usuario) {
                return res.json({ 
                    success: false, 
                    message: "Usuario requerido" 
                });
            }
            
            const query = "SELECT usuario FROM administradores WHERE usuario = ?";
            
            db.query(query, [usuario.trim()], (err, results) => {
                if (err) {
                    console.error("Error:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error en la base de datos" 
                    });
                }
                
                if (results.length === 0) {
                    return res.json({ 
                        success: false, 
                        message: "Administrador no encontrado" 
                    });
                }
                
                res.json({
                    success: true,
                    message: "Administrador encontrado",
                    admin: results[0]
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

    eliminarAdmin: function(req, res) {
        try {
            const { usuario } = req.body;
            
            if (!usuario) {
                return res.json({ 
                    success: false, 
                    message: "Usuario requerido" 
                });
            }
            
            const query = "DELETE FROM administradores WHERE usuario = ?";
            
            db.query(query, [usuario.trim()], (err, result) => {
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
                        message: "Administrador no encontrado" 
                    });
                }
                
                res.json({
                    success: true,
                    message: "Administrador eliminado exitosamente"
                });
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

module.exports = adminController;