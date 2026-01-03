// APIS/admin.api.js
const express = require("express");
const router = express.Router();
const adminController = require("../controladores/controladores-admin/admin.controlador");

// Rutas para administradores
router.post("/registrar", adminController.registrarAdmin);
router.get("/buscar", adminController.buscarAdmin);
router.delete("/eliminar", adminController.eliminarAdmin);

module.exports = router;