// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// Registrar nueva materia
router.post("/registrar", materiasController.registrarMateria);

// Listar todas las materias
router.get("/listar", materiasController.listarMaterias);

// Buscar materia por ID
router.get("/buscar/:id", materiasController.buscarMateriaPorId);

// Buscar materias por nombre
router.get("/buscar/nombre/:nombre", materiasController.buscarMateriasPorNombre);

// Eliminar materia
router.delete("/eliminar", materiasController.eliminarMateria);

module.exports = router;