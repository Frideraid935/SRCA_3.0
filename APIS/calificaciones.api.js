const express = require('express');
const router = express.Router();
const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

router.post('/registrar', calificaciones.registrar);
router.get('/:id', calificaciones.buscarPorId);
router.put('/actualizar/:id', calificaciones.actualizar);

module.exports = router;

