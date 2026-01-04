const express = require('express');
const router = express.Router();
const profesoresController = require('../controladores/controladores-profesores/profesores.controlador');

// Ruta para listar profesores
router.get('/listar', profesoresController.listarProfesores);

module.exports = router;
