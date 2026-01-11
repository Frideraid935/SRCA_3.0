// profesores.controlador.js - Versión corregida
const db = require('../../BD/BD.js');

const profesoresController = {

    // Registrar nuevo profesor - VERSIÓN SIMPLIFICADA
    registrar: (req, res) => {
        console.log('Datos recibidos en registrar:', req.body);
        
        const { numero_de_control, nombre, especialidad } = req.body;

        // Validación básica
        if (!numero_de_control || !nombre || !especialidad) {
            console.log('Faltan campos');
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si ya existe
        const checkSql = 'SELECT numero_de_control FROM profesores WHERE numero_de_control = ?';
        
        db.query(checkSql, [numero_de_control], (err, rows) => {
            if (err) {
                console.error('Error verificando:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al verificar profesor'
                });
            }

            if (rows.length > 0) {
                console.log('Ya existe profesor con ese número');
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un profesor con este número de control'
                });
            }

            // Insertar nuevo profesor
            const insertSql = 'INSERT INTO profesores (numero_de_control, nombre, especialidad) VALUES (?, ?, ?)';
            
            db.query(insertSql, [numero_de_control, nombre, especialidad], (err, result) => {
                if (err) {
                    console.error('Error insertando:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error al registrar profesor'
                    });
                }

                console.log('Profesor registrado con éxito, ID:', result.insertId);
                
                // ENVIAR RESPUESTA - ESTO ES CRÍTICO
                res.status(201).json({
                    success: true,
                    message: 'Profesor registrado correctamente',
                    id: result.insertId
                });
            });
        });
    },

    // Buscar profesor - VERSIÓN SIMPLIFICADA
    buscar: (req, res) => {
        const { id } = req.params;
        console.log('Buscando profesor con ID:', id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un número de control'
            });
        }

        const sql = 'SELECT numero_de_control, nombre, especialidad FROM profesores WHERE numero_de_control = ?';
        
        db.query(sql, [id], (err, rows) => {
            if (err) {
                console.error('Error buscando:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al buscar profesor'
                });
            }

            if (rows.length === 0) {
                console.log('Profesor no encontrado');
                return res.status(404).json({
                    success: false,
                    message: 'Profesor no encontrado'
                });
            }

            console.log('Profesor encontrado:', rows[0]);
            
            // ENVIAR RESPUESTA
            res.status(200).json({
                success: true,
                profesor: rows[0]
            });
        });
    },

    // ... otras funciones similares
};

module.exports = profesoresController;