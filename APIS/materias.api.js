// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// Ruta para registrar nueva materia
router.post("/registrar", materiasController.registrarMateria);

// Ruta para listar todas las materias
router.get("/listar", materiasController.listarMaterias);

// Ruta para buscar materias por nombre (nueva funcionalidad)
router.get("/buscar", materiasController.buscarMateriasPorNombre);

// Ruta para obtener materia por ID (nueva funcionalidad)
router.get("/:id", materiasController.obtenerMateriaPorId);

// Ruta para eliminar materia
router.delete("/eliminar", materiasController.eliminarMateria);

module.exports = router;