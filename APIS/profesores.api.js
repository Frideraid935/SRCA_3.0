// profesores.api.js
const express = require('express');
const router = express.Router();
const profesoresController = require('../controladores/controladores-profesores/profesores.controlador');

// Registrar profesor
router.post('/registrar', profesoresController.registrarProfesor);

// Listar todos los profesores
router.get('/listar', profesoresController.listarProfesores);

// Buscar profesor por número de control
router.get('/buscar/:numero', profesoresController.buscarProfesorPorNumero);

// Actualizar profesor
router.put('/actualizar', profesoresController.actualizarProfesor);

// Eliminar profesor
router.delete('/eliminar', profesoresController.eliminarProfesor);

module.exports = router;