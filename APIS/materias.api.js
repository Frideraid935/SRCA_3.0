// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// Ruta para REGISTRAR materia
router.post("/registrar", materiasController.registrarMateria);

// Ruta para BUSCAR materia (para eliminar)
router.get("/buscar", materiasController.buscarMateriaParaEliminar);

// Ruta para ELIMINAR materia
router.delete("/eliminar", materiasController.eliminarMateria);

module.exports = router;