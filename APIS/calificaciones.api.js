const express = require('express');
const router = express.Router();
const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

// Registrar
router.post('/registrar', calificacionesController.registrar);

// Buscar por Alumno + Materia
router.get('/buscar', calificacionesController.buscar);

// Actualizar por ID
router.put('/actualizar/:id', calificacionesController.actualizar);

module.exports = router;
