// profesores.api.js
const express = require('express');
const router = express.Router();
const profesoresController = require('../controladores/controladores-profesores/profesores.controlador');

// Rutas CRUD para profesores
router.get('/listar', profesoresController.listarProfesores);
router.post('/registrar', profesoresController.registrar);
router.get('/buscar/:id', profesoresController.buscar);
router.put('/actualizar/:id', profesoresController.actualizar);
router.delete('/eliminar/:id', profesoresController.eliminar);

module.exports = router;