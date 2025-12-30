// alumnos.api.js - VERSIÓN CORRECTA
const express = require("express");
const router = express.Router();
const alumnos = require("../controladores/controladores-alumnos/alumnos.controlador");

// Rutas
router.post("/registrar", alumnos.registrarAlumno);
router.get("/listar", alumnos.listarAlumnos);
router.get("/buscar/:numero", alumnos.buscarAlumnoPorNumero);
router.put("/actualizar", alumnos.actualizarAlumno);
router.delete("/eliminar", alumnos.eliminarAlumno);

// Exportar el router CORRECTAMENTE
module.exports = router; // ← Exporta solo el router