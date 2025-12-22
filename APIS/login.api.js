const express = require("express");
const router = express.Router();
const pool = require("../BD/BD");

router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ success: false, message: "Datos incompletos" });
    }

    try {
        const [rows] = await pool.query(
            `SELECT * FROM administradores WHERE usuario = ? AND password = ? 
             UNION
             SELECT * FROM profesores WHERE usuario = ? AND password = ? 
             UNION
             SELECT * FROM alumnos WHERE usuario = ? AND password = ?`,
            [usuario, password, usuario, password, usuario, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }

        const user = rows[0];
        res.json({ success: true, user: { id: user.id, nombre: user.nombre, tipo: user.tipo || "Alumno" } });

    } catch (error) {
        console.error("Error en login:", error.message);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

module.exports = router;
