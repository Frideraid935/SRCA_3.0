const express = require("express");
const router = express.Router();
const pool = require("../BD/BD");

router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({
            success: false,
            message: "Datos incompletos"
        });
    }

    try {
        const [rows] = await pool.query(
            `SELECT 'admin' AS rol, usuario, contrasena FROM administradores WHERE usuario = ? AND contrasena = ?
             UNION
             SELECT 'profesor' AS rol, usuario, contrasena FROM profesores WHERE usuario = ? AND contrasena = ?
             UNION
             SELECT 'alumno' AS rol, usuario, contrasena FROM alumnos WHERE usuario = ? AND contrasena = ?`,
            [usuario, password, usuario, password, usuario, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Usuario o contraseña incorrectos"
            });
        }

        const usuarioEncontrado = rows[0];

        return res.json({
            success: true,
            rol: usuarioEncontrado.rol,
            usuario: usuarioEncontrado.usuario
        });

    } catch (error) {
        console.error("Error en login:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error del servidor"
        });
    }
});

module.exports = router;
