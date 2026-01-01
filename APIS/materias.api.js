// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// RUTAS PARA MATERIAS
router.post("/registrar", materiasController.registrarMateria);
router.get("/buscar", materiasController.buscarMateria);
router.delete("/eliminar", materiasController.eliminarMateria);

module.exports = router;