const db = require("../../BD/BD.js");

/* ===============================
   REGISTRAR SALÓN
================================ */
exports.registrarSalon = async (req, res) => {
  try {
    const { nombre, capacidad, profesor_id } = req.body;

    if (!nombre || !capacidad || !profesor_id) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const sql = `
      INSERT INTO salones (nombre, capacidad, profesor_id)
      VALUES (?, ?, ?)
    `;

    await pool.query(sql, [nombre, capacidad, profesor_id]);

    res.json({ mensaje: 'Salón registrado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar salón' });
  }
};

/* ===============================
   BUSCAR SALÓN POR ID
================================ */
exports.buscarSalon = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM salones WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Salón no encontrado' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al buscar salón' });
  }
};

/* ===============================
   ELIMINAR SALÓN
================================ */
exports.eliminarSalon = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM salones WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Salón no encontrado' });
    }

    res.json({ mensaje: 'Salón eliminado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar salón' });
  }
};
