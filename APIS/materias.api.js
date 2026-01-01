// APIS/materias.api.js
const express = require("express");
const router = express.Router();
const materiasController = require("../controladores/controladores-materias/materias.controlador");

// Registrar nueva materia
router.post("/registrar", materiasController.registrarMateria);

// Listar todas las materias
router.get("/listar", materiasController.listarMaterias);

// Buscar materia por ID
router.get("/buscar/:id", materiasController.buscarMateriaPorId);

// Actualizar materia
router.put("/actualizar", materiasController.actualizarMateria);

// Eliminar materia
router.delete("/eliminar", materiasController.eliminarMateria);

// Buscar materia por término
router.get("/buscar/termino/:termino", materiasController.buscarMateriaPorTermino);

// Obtener profesores para selector
router.get("/profesores/lista", materiasController.obtenerProfesoresParaSelector);

// Obtener materias por profesor
router.get("/profesor/:profesorId", materiasController.obtenerMateriasPorProfesor);

// Verificar código de materia
router.get("/verificar-codigo/:codigo", materiasController.verificarCodigoMateria);

// Obtener estadísticas
router.get("/estadisticas", materiasController.obtenerEstadisticasMaterias);

module.exports = router;