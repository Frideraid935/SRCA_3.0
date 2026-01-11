// profesores.api.js
const express = require('express');
const router = express.Router();
const profesoresController = require('../controladores/controladores-profesores/profesores.controlador');

// Ruta para registrar profesor
router.post('/registrar', profesoresController.registrar);

// Ruta para buscar profesor
router.get('/buscar/:id', profesoresController.buscar);

// Ruta para actualizar profesor
router.put('/actualizar', profesoresController.actualizar);

// Ruta para eliminar profesor
router.delete('/eliminar', profesoresController.eliminar);

// Ruta para listar todos los profesores
router.get('/listar', profesoresController.listar);

module.exports = router;