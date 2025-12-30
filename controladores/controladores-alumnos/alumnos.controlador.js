const pool = require("../../BD/BD");

/* ===============================
   REGISTRAR ALUMNO
================================ */
exports.registrarAlumno = async (req, res) => {
  try {
    const {
      numero_de_control, nombre, fecha_nacimiento, curso,
      poblacion, direccion, email, telefonos, curp,
      alergico, contacto_accidente, telefonos_contacto,
      nombre_autorizado, curp_autorizado
    } = req.body;

    const [existe] = await pool.query(
      "SELECT id FROM alumnos WHERE numero_de_control = ?",
      [numero_de_control]
    );

    if (existe.length > 0) {
      return res.json({ status: "error", message: "El número de control ya existe." });
    }

    await pool.query(
      `INSERT INTO alumnos 
      (numero_de_control, nombre, fecha_nacimiento, curso, poblacion, direccion, email, telefonos, curp,
       alergico, contacto_accidente, telefonos_contacto, nombre_autorizado, curp_autorizado, estatus)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        numero_de_control, nombre, fecha_nacimiento, curso, poblacion, direccion,
        email, telefonos, curp, alergico, contacto_accidente,
        telefonos_contacto, nombre_autorizado, curp_autorizado, "activo"
      ]
    );

    res.json({ status: "success", message: "Alumno registrado exitosamente." });

  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

/* ===============================
   LISTAR ALUMNOS
================================ */
exports.listarAlumnos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, fecha_nacimiento, numero_de_control FROM alumnos"
    );
    res.json(rows);
  } catch (error) {
    res.json([]);
  }
};

/* ===============================
   ACTUALIZAR ALUMNO
================================ */
exports.actualizarAlumno = async (req, res) => {
  try {
    const {
      numero_de_control, nombre, fecha_nacimiento, curso,
      poblacion, direccion, email, telefonos, curp,
      estatus, alergico, contacto_accidente,
      telefonos_contacto, nombre_autorizado, curp_autorizado
    } = req.body;

    const [result] = await pool.query(
      `UPDATE alumnos SET
        nombre=?, fecha_nacimiento=?, curso=?, poblacion=?, direccion=?,
        email=?, telefonos=?, curp=?, estatus=?, alergico=?,
        contacto_accidente=?, telefonos_contacto=?, nombre_autorizado=?, curp_autorizado=?
      WHERE numero_de_control=?`,
      [
        nombre, fecha_nacimiento, curso, poblacion, direccion,
        email, telefonos, curp, estatus, alergico,
        contacto_accidente, telefonos_contacto,
        nombre_autorizado, curp_autorizado, numero_de_control
      ]
    );

    if (result.affectedRows === 0) {
      return res.json({ status: "error", message: "Alumno no encontrado." });
    }

    res.json({ status: "success", message: "Alumno actualizado correctamente." });

  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

/* ===============================
   ELIMINAR ALUMNO
================================ */
exports.eliminarAlumno = async (req, res) => {
  try {
    const { numero_de_control } = req.body;

    const [result] = await pool.query(
      "DELETE FROM alumnos WHERE numero_de_control = ?",
      [numero_de_control]
    );

    if (result.affectedRows === 0) {
      return res.json({ status: "error", message: "Alumno no encontrado." });
    }

    res.json({ status: "success", message: "Alumno eliminado correctamente." });

  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};
