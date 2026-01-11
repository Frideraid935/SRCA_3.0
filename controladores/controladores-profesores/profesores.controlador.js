// profesores.controlador.js - VERSIÓN MÍNIMA FUNCIONAL
const db = require('../../BD/BD.js');

const profesoresController = {

    // 1. LISTAR (simple)
    listarProfesores: (req, res) => {
        const sql = 'SELECT numero_de_control, nombre, especialidad FROM profesores';
        db.query(sql, (err, rows) => {
            if (err) return res.status(500).json({ success: false, message: 'Error' });
            res.json({ success: true, profesores: rows });
        });
    },

    // 2. REGISTRAR (simple)
    registrar: (req, res) => {
        const { numero_de_control, nombre, especialidad } = req.body;
        if (!numero_de_control || !nombre || !especialidad) {
            return res.status(400).json({ success: false, message: 'Faltan campos' });
        }
        
        const sql = 'INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
        db.query(sql, [numero_de_control, nombre, especialidad], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'Error' });
            res.json({ success: true, message: 'Profesor registrado' });
        });
    },

    // 3. BUSCAR (simple)
    buscar: (req, res) => {
        const { id } = req.params;
        const sql = 'SELECT numero_de_control, nombre, especialidad FROM profesores WHERE numero_de_control = ?';
        db.query(sql, [id], (err, rows) => {
            if (err) return res.status(500).json({ success: false, message: 'Error' });
            if (rows.length === 0) return res.status(404).json({ success: false, message: 'No encontrado' });
            res.json({ success: true, profesor: rows[0] });
        });
    },

    // 4. ACTUALIZAR (simple)
    actualizar: (req, res) => {
        const { id } = req.params;
        const { nombre, especialidad } = req.body;
        const sql = 'UPDATE profesores SET nombre = ?, especialidad = ? WHERE numero_de_control = ?';
        db.query(sql, [nombre, especialidad, id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'Error' });
            res.json({ success: true, message: 'Profesor actualizado' });
        });
    },

    // 5. ELIMINAR (simple)
    eliminar: (req, res) => {
        const { id } = req.params;
        const sql = 'DELETE FROM profesores WHERE numero_de_control = ?';
        db.query(sql, [id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'Error' });
            res.json({ success: true, message: 'Profesor eliminado' });
        });
    }

};

module.exports = profesoresController;