const express = require('express');
const router = express.Router();

const salones = require('../controladores/controladores-salones/salones.controlador');

// Registrar
router.post('/registrar', salones.registrarSalon);

// Buscar por ID
router.get('/buscar/:id', salones.buscarSalon);

// Eliminar
router.delete('/eliminar/:id', salones.eliminarSalon);

module.exports = router;
