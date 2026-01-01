// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// SOLO las rutas que EXISTEN
router.post("/registrar", materiasController.registrarMateria);
router.get("/buscar", materiasController.buscarMateriaParaEliminar);
router.delete("/eliminar", materiasController.eliminarMateria);
router.get("/listar", materiasController.listarMaterias);

module.exports = router;