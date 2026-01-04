// controladores/controladores-profesores/profesores.controlador.js
const db = require('../../BD/BD.js');

const profesoresController = {

    // Listar todos los profesores
    listarProfesores: (req, res) => {
        const sql = 'SELECT numero_de_control, nombre FROM profesores';
        db.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al obtener profesores' });
            }
            res.json(rows);
        });
    }
};

module.exports = profesoresController;
