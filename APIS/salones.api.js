const express = require('express');
const router = express.Router();

const salonesController = require('../controladores/controladores-salones/salones.controlador');

// REGISTRAR
router.post('/registrar', salonesController.registrarSalon);

// BUSCAR
router.get('/buscar/:id', salonesController.buscarSalon);

// ELIMINAR
router.delete('/eliminar/:id', salonesController.eliminarSalon);

module.exports = router;
