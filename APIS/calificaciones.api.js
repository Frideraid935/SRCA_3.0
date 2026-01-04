const express = require('express');
const router = express.Router();

/* Import del controlador */
const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

/* =========================
   RUTAS CALIFICACIONES
========================= */

// Registrar calificación
router.post('/registrar', calificacionesController.registrar);

// Buscar calificación por ID
router.get('/buscar/:id', calificacionesController.buscarPorId);

// Buscar calificación por Alumno y Materia
// Ejemplo: /api/calificaciones/buscar?alumno=martina&materia=Matemáticas
router.get('/buscar', calificacionesController.buscarPorAlumnoMateria);

// Actualizar calificación por ID
router.put('/actualizar/:id', calificacionesController.actualizar);

module.exports = router;
