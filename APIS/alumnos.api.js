const express = require("express");
const router = express.Router();
const alumnos = require("../controladores/controladores-alumnos/alumnos.controlador"); // Ajusta la ruta según tu proyecto

// Rutas
router.post("/registrar", alumnos.registrarAlumno);
router.get("/listar", alumnos.listarAlumnos);
router.put("/actualizar", alumnos.actualizarAlumno);
router.delete("/eliminar", alumnos.eliminarAlumno);

module.exports = router;

