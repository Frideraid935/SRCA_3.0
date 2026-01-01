// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// SOLO las rutas que SÍ existen en el controlador
router.post("/registrar", materiasController.registrarMateria);
router.get("/listar", materiasController.listarMaterias);
router.get("/buscar", materiasController.buscarMateriasPorNombre);
// NOTA: Quité router.get("/:id") porque obtenerMateriaPorId NO existe
router.delete("/eliminar", materiasController.eliminarMateria);

module.exports = router;