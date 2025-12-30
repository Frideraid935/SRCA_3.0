const express = require("express");
const router = express.Router();
const alumnos = require("../controladores/controladores-alumnos/alumnos.controlador");

// Crear alumno
router.post("/registrar", alumnos.registrarAlumno);

// Listar todos
router.get("/listar", alumnos.listarAlumnos);

// Buscar por número de control
router.get("/buscar/:numero", alumnos.buscarAlumnoPorNumero);

// Actualizar alumno
router.put("/actualizar", alumnos.actualizarAlumno);

// Eliminar alumno
router.delete("/eliminar", alumnos.eliminarAlumno);

module.exports = router;
