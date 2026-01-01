// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// SOLO estas 3 rutas (todas existen)
router.post("/registrar", materiasController.registrarMateria);
router.get("/buscar", materiasController.buscarMateriaParaEliminar);
router.delete("/eliminar", materiasController.eliminarMateria);

module.exports = router;