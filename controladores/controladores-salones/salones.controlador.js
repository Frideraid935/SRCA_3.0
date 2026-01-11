const db = require('../../BD/BD');

const salonesController = {

  registrar: (req, res) => {
    const { id_salon, nombre_salon, capacidad, numero_de_control } = req.body;

    if (!id_salon || !nombre_salon || !capacidad || !numero_de_control) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const sql = `
      INSERT INTO salones (id_salon, nombre_salon, capacidad, numero_de_control)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [id_salon, nombre_salon, capacidad, numero_de_control], (err) => {
      if (err) {
        console.error('ERROR REGISTRAR SALON:', err);
        return res.status(500).json({ message: 'Error al registrar salón' });
      }

      res.json({ message: 'Salón registrado correctamente' });
    });
  },

  buscar: (req, res) => {
    const { id } = req.params;

    const sql = `
      SELECT id_salon, nombre_salon, capacidad, numero_de_control
      FROM salones
      WHERE id_salon = ?
    `;

    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.error('ERROR BUSCAR SALON:', err);
        return res.status(500).json({ message: 'Error al buscar salón' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Salón no encontrado' });
      }

      res.json(rows[0]);
    });
  },

  eliminar: (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM salones WHERE id_salon = ?';

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('ERROR ELIMINAR SALON:', err);
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
