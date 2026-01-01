// APIS/materias.api.js - VERSIÓN SIMPLE
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// Registrar nueva materia
router.post("/registrar", materiasController.registrarMateria);

// Listar todas las materias
router.get("/listar", materiasController.listarMaterias);

// Eliminar materia
router.delete("/eliminar", materiasController.eliminarMateria);

module.exports = router;