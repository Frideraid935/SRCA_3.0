const express = require("express");
const router = express.Router();
const alumnosController = require("../controladores/controladores-alumnos/alumnos.controlador");

// Registrar alumno
router.post("/registrar", alumnosController.registrarAlumno);

// Listar todos los alumnos
router.get("/listar", alumnosController.listarAlumnos);

// Buscar alumno por número de control
router.get("/buscar/:numero", alumnosController.buscarAlumnoPorNumero);

// Actualizar alumno
router.put("/actualizar", alumnosController.actualizarAlumno);

// Eliminar alumno
router.delete("/eliminar", alumnosController.eliminarAlumno);

module.exports = router;