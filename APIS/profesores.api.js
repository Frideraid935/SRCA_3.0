const express = require('express');
const router = express.Router();
const profesoresController = require('../controladores/controladores-profesores/profesores.controlador');

// Listar todos los profesores
router.get('/listar', profesoresController.listarProfesores);

module.exports = router;
