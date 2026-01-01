// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// Solo 2 endpoints básicos
router.post("/registrar", materiasController.registrarMateria);
router.delete("/eliminar", materiasController.eliminarMateriaPorNombre);

module.exports = router;