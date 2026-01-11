const db = require("../../BD/BD.js");


/* ===============================
   REGISTRAR SALÓN
================================ */
exports.registrar = async (req, res) => {
  try {
    const { nombre, capacidad, profesor_id } = req.body;

    // Verificar profesor
    const [profesor] = await pool.query(
      'SELECT * FROM profesores WHERE numero_de_control = ?',
      [profesor_id]
    );

    if (profesor.length === 0) {
      return res.json({ ok: false, mensaje: 'El profesor no existe' });
    }

    await pool.query(
      'INSERT INTO salones (nombre, capacidad, profesor_id) VALUES (?, ?, ?)',
      [nombre, capacidad, profesor_id]
    );

    res.json({ ok: true, mensaje: 'Salón registrado correctamente' });

  } catch (error) {
    res.json({ ok: false, mensaje: 'Error al registrar el salón' });
  }
};

/* ===============================
   BUSCAR SALÓN
================================ */
exports.buscar = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT s.id, s.nombre, s.capacidad,
             p.numero_de_control AS profesor_id,
             p.nombre AS profesor_nombre
      FROM salones s
      JOIN profesores p ON s.profesor_id = p.numero_de_control
      WHERE s.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.json({ ok: false, mensaje: 'Salón no encontrado' });
    }

    res.json({
      ok: true,
      data: rows[0]
    });

  } catch (error) {
    res.json({ ok: false, mensaje: 'Error al buscar salón' });
  }
};

/* ===============================
   ELIMINAR SALÓN
================================ */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const [existe] = await pool.query(
      'SELECT * FROM salones WHERE id = ?',
      [id]
    );

    if (existe.length === 0) {
      return res.json({ ok: false, mensaje: 'El salón no existe' });
    }

    await pool.query('DELETE FROM salones WHERE id = ?', [id]);

    res.json({ ok: true, mensaje: 'Salón eliminado correctamente' });

  } catch (error) {
    res.json({ ok: false, mensaje: 'Error al eliminar salón' });
  }
};
