const express = require('express');
const router = express.Router();

const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

// Registrar calificación
router.post('/registrar', calificacionesController.registrar);

// Buscar calificación por alumno + materia
router.get('/buscar', calificacionesController.buscar);

// Actualizar calificación por id
router.put('/actualizar/:id', calificacionesController.actualizar);

module.exports = router;
