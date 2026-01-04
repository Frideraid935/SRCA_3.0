const express = require('express');
const router = express.Router();

const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

// Registrar calificación manual
router.post('/registrar', calificacionesController.registrar);

// Buscar calificación por Alumno + Materia
router.get('/buscar', calificacionesController.buscar);

// Actualizar calificación por ID
router.put('/actualizar/:id', calificacionesController.actualizar);

module.exports = router;
