const pool = require("../../BD/BD");

exports.registrarAlumno = async (req, res) => {
    try {
        const {
            numero_de_control, nombre, fecha_nacimiento, curso,
            poblacion, direccion, email, telefonos, curp,
            alergico, contacto_accidente, telefonos_contacto,
            nombre_autorizado, curp_autorizado
        } = req.body;

        // Verificar si el número de control ya existe
        const [existe] = await pool.query(
            "SELECT id FROM alumnos WHERE numero_de_control = ?",
            [numero_de_control]
        );

        if (existe.length > 0) {
            return res.json({ 
                status: "error", 
                message: "El número de control ya está registrado." 
            });
        }

        // Insertar nuevo alumno
        await pool.query(
            `INSERT INTO alumnos (
                numero_de_control, nombre, fecha_nacimiento, curso, 
                poblacion, direccion, email, telefonos, curp,
                alergico, contacto_accidente, telefonos_contacto,
                nombre_autorizado, curp_autorizado, estatus
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                numero_de_control, nombre, fecha_nacimiento, curso, 
                poblacion, direccion, email, telefonos, curp,
                alergico || null, contacto_accidente || null, 
                telefonos_contacto || null, nombre_autorizado || null, 
                curp_autorizado || null, "activo"
            ]
        );

        res.json({ 
            status: "success", 
            message: "Alumno registrado exitosamente." 
        });

    } catch (error) {
        console.error("Error en registrarAlumno:", error);
        res.json({ 
            status: "error", 
            message: "Error al registrar el alumno." 
        });
    }
};

exports.listarAlumnos = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                id, numero_de_control, nombre, fecha_nacimiento, 
                curso, poblacion, direccion, email, telefonos, 
                curp, estatus, alergico, contacto_accidente,
                telefonos_contacto, nombre_autorizado, curp_autorizado
             FROM alumnos 
             ORDER BY nombre ASC`
        );
        
        res.json(rows);
        
    } catch (error) {
        console.error("Error en listarAlumnos:", error);
        res.json([]);
    }
};

exports.buscarAlumnoPorNumero = async (req, res) => {
    try {
        const { numero } = req.params;
        
        const [rows] = await pool.query(
            `SELECT 
                id, numero_de_control, nombre, fecha_nacimiento, 
                curso, poblacion, direccion, email, telefonos, 
                curp, estatus, alergico, contacto_accidente,
                telefonos_contacto, nombre_autorizado, curp_autorizado
             FROM alumnos 
             WHERE numero_de_control = ?`,
            [numero]
        );

        if (rows.length === 0) {
            return res.json({ 
                status: "error", 
                message: "Alumno no encontrado." 
            });
        }

        res.json(rows[0]);
        
    } catch (error) {
        console.error("Error en buscarAlumnoPorNumero:", error);
        res.json({ 
            status: "error", 
            message: "Error al buscar el alumno." 
        });
    }
};

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
                nombre = ?, fecha_nacimiento = ?, curso = ?, 
                poblacion = ?, direccion = ?, email = ?, 
                telefonos = ?, curp = ?, estatus = ?, 
                alergico = ?, contacto_accidente = ?, 
                telefonos_contacto = ?, nombre_autorizado = ?, 
                curp_autorizado = ?
            WHERE numero_de_control = ?`,
            [
                nombre, fecha_nacimiento, curso, poblacion, direccion,
                email, telefonos, curp, estatus || 'activo', 
                alergico || null, contacto_accidente || null,
                telefonos_contacto || null, nombre_autorizado || null, 
                curp_autorizado || null, numero_de_control
            ]
        );

        if (result.affectedRows === 0) {
            return res.json({ 
                status: "error", 
                message: "Alumno no encontrado." 
            });
        }

        res.json({ 
            status: "success", 
            message: "Alumno actualizado correctamente." 
        });
        
    } catch (error) {
        console.error("Error en actualizarAlumno:", error);
        res.json({ 
            status: "error", 
            message: "Error al actualizar el alumno." 
        });
    }
};

exports.eliminarAlumno = async (req, res) => {
    try {
        const { numero_de_control } = req.body;

        const [result] = await pool.query(
            "DELETE FROM alumnos WHERE numero_de_control = ?",
            [numero_de_control]
        );

        if (result.affectedRows === 0) {
            return res.json({ 
                status: "error", 
                message: "Alumno no encontrado." 
            });
        }

        res.json({ 
            status: "success", 
            message: "Alumno eliminado correctamente." 
        });
        
    } catch (error) {
        console.error("Error en eliminarAlumno:", error);
        res.json({ 
            status: "error", 
            message: "Error al eliminar el alumno." 
        });
    }
};