const db = require('../../BD/BD.js');

const salonesController = {

  // REGISTRAR
  registrar: (req, res) => {
    const { nombre, capacidad, profesor_id } = req.body;

    if (!nombre || !capacidad || !profesor_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // validar que el profesor exista
    const validarProfesor = 'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?';

    db.query(validarProfesor, [profesor_id], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error validando profesor' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: 'El profesor no existe' });
      }

      const sql = `
        INSERT INTO salones (nombre, capacidad, profesor_id)
        VALUES (?, ?, ?)
      `;

      db.query(sql, [nombre, capacidad, profesor_id], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al registrar salón' });
        }

        res.json({ message: 'Salón registrado correctamente' });
      });
    });
  },

  // BUSCAR
  buscar: (req, res) => {
    const { id } = req.params;

    const sql = `
      SELECT 
        s.id,
        s.nombre,
        s.capacidad,
        p.numero_de_control AS profesor_id,
        p.nombre AS profesor_nombre
      FROM salones s
      INNER JOIN profesores p ON s.profesor_id = p.numero_de_control
      WHERE s.id = ?
    `;

    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al buscar salón' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Salón no encontrado' });
      }

      res.json(rows[0]);
    });
  },

  // ELIMINAR
  eliminar: (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM salones WHERE id = ?';

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al eliminar salón' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Salón no encontrado' });
      }

      res.json({ message: 'Salón eliminado correctamente' });
    });
  }
};

module.exports = salonesController;
