const express = require('express');
const router = express.Router();

/* Import correcto */
const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

/* Rutas */
router.post('/registrar', calificacionesController.registrar);
router.get('/:id', calificacionesController.buscarPorId);
router.put('/actualizar/:id', calificacionesController.actualizar);

module.exports = router;
