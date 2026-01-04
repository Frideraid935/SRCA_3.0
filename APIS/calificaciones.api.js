const express = require('express');
const router = express.Router();
const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

router.post('/registrar', calificacionesController.registrar);
router.get('/buscar', calificacionesController.buscarPorNombre); // buscar por nombre del alumno
router.put('/actualizar/:id', calificacionesController.actualizar);

module.exports = router;
