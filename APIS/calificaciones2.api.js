// APIS/calificaciones.api.js
const express = require('express');
const router = express.Router();
const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador2');

// Ruta para buscar calificaciones por número de control del alumno
router.get('/buscar/:id', calificacionesController.buscarPorAlumno);

module.exports = router;