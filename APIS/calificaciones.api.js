const express = require('express');
const router = express.Router();

const calificacionesController = require('../controladores/controladores-calificaciones/calificaciones.controlador');

// =========================
// RUTAS DE CALIFICACIONES
// =========================
router.post('/registrar', calificacionesController.registrar);   // Registrar calificación
router.get('/listar', calificacionesController.listar);         // Listar todas las calificaciones
router.put('/actualizar/:id', calificacionesController.actualizar); // Actualizar calificación por ID

module.exports = router;
