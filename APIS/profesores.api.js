// profesores.api.js
const express = require('express');
const router = express.Router();

// Asegúrate de que la ruta del controlador sea correcta
const profesoresController = require('../controladores/controladores-profesores/profesores.controlador.js');

// Rutas CRUD para profesores
router.get('/listar', profesoresController.listarProfesores);
router.post('/registrar', profesoresController.registrar);
router.get('/buscar/:id', profesoresController.buscar);
router.put('/actualizar/:id', profesoresController.actualizar);
router.delete('/eliminar/:id', profesoresController.eliminar);

// Ruta de prueba para debug
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API de profesores funcionando',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;