// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// SOLO 2 endpoints
router.post("/registrar", materiasController.registrarMateria);
router.delete("/eliminar", materiasController.eliminarMateriaPorNombre);
router.get('/listar', materiasController.listarMaterias);

module.exports = router;