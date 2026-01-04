const express = require('express');
const router = express.Router();

const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

router.post('/registrar', calificacionesController.registrar);
router.get('/buscar', calificacionesController.buscar);
router.put('/actualizar', calificacionesController.actualizar);

module.exports = router;
