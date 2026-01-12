// salones.api.js
const express = require('express');
const router = express.Router();

const salones = require('../controladores/controladores-salones/salones.controlador');

router.post('/registrar', salones.registrar);
router.get('/buscar/:id', salones.buscar);
router.delete('/eliminar/:id', salones.eliminar);
router.get('/listar', salones.listar); // Nueva ruta

module.exports = router;