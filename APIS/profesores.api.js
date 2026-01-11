// profesores.api.js
const express = require('express');
const router = express.Router();
const profesoresController = require('../controladores/controladores-profesores/profesores.controlador');

// ============ RUTA EXISTENTE ============
// Ruta para listar profesores (YA EXISTE - FUNCIONAL)
router.get('/listar', profesoresController.listarProfesores);

// ============ AÑADIR ESTAS RUTAS NUEVAS ============
// Rutas CRUD para profesores
router.post('/registrar', profesoresController.registrar);
router.get('/buscar/:id', profesoresController.buscar);
router.put('/actualizar/:id', profesoresController.actualizar);
router.delete('/eliminar/:id', profesoresController.eliminar);

module.exports = router;