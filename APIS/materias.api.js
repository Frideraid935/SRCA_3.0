// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// Solo 3 endpoints básicos que SÍ funcionan
router.post("/registrar", materiasController.registrarMateria);
router.get("/listar", materiasController.listarMaterias);
router.delete("/eliminar", materiasController.eliminarMateria);

module.exports = router;