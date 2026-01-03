// controladores/controladores-admin/admin.controlador.js
const db = require("../../BD/BD.js");

const adminController = {
    // REGISTRAR administrador
    registrarAdmin: function(req, res) {
        try {
            const { usuario, contrasena } = req.body;
            
            console.log('Registrando admin:', usuario);
            
            if (!usuario || usuario.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "El nombre de usuario es requerido" 
                });
            }
            
            if (!contrasena || contrasena.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "La contraseña es requerida" 
                });
            }
            
            const query = "INSERT INTO administradores (usuario, contrasena) VALUES (?, ?)";
            const usuarioLimpio = usuario.trim();
            const contrasenaLimpia = contrasena.trim(); // En producción usa bcrypt
            
            db.query(query, [usuarioLimpio, contrasenaLimpia], (err, result) => {
                if (err) {
                    console.error("Error SQL:", err);
                    
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.json({ 
                            success: false, 
                            message: "Este nombre de usuario ya existe" 
                        });
                    }
                    
                    return res.json({ 
                        success: false, 
                        message: "Error al registrar en la base de datos" 
                    });
                }
                
                console.log('Admin registrado:', usuarioLimpio);
                res.json({
                    success: true,
                    message: "Administrador registrado exitosamente"
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

    // BUSCAR administrador por usuario
    buscarAdmin: function(req, res) {
        try {
            const usuario = req.query.usuario || '';
            
            console.log('Buscando admin:', usuario);
            
            if (!usuario || usuario.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "Escriba un nombre de usuario" 
                });
            }
            
            const query = "SELECT usuario FROM administradores WHERE usuario = ?";
            
            db.query(query, [usuario.trim()], (err, results) => {
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
                message: "Error interno del servidor" 
            });
        }
    },

    // ELIMINAR administrador por usuario
    eliminarAdmin: function(req, res) {
        try {
            const { usuario } = req.body;
            
            console.log('Eliminando admin:', usuario);
            
            if (!usuario || usuario.trim() === '') {
                return res.json({ 
                    success: false, 
                    message: "Usuario requerido" 
                });
            }
            
            // Verificar que no sea el último administrador
            const countQuery = "SELECT COUNT(*) as total FROM administradores";
            
            db.query(countQuery, (err, countResults) => {
                if (err) {
                    console.error("Error SQL:", err);
                    return res.json({ 
                        success: false, 
                        message: "Error en la base de datos" 
                    });
                }
                
                const totalAdmins = countResults[0].total;
                
                if (totalAdmins <= 1) {
                    return res.json({ 
                        success: false, 
                        message: "No se puede eliminar el único administrador" 
                    });
                }
                
                // Eliminar el administrador
                const deleteQuery = "DELETE FROM administradores WHERE usuario = ?";
                
                db.query(deleteQuery, [usuario.trim()], (err, result) => {
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
                            message: "Administrador no encontrado" 
                        });
                    }
                    
                    console.log('Admin eliminado:', usuario);
                    res.json({
                        success: true,
                        message: "Administrador eliminado exitosamente"
                    });
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

module.exports = adminController;