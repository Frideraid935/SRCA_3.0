// profesores.js - Frontend JavaScript para manejar profesores

// ========== CONFIGURACIÓN DE API ==========
// Para Railway, usamos la URL actual del navegador
const API_BASE_URL = window.location.origin + '/api/profesores';

// ========== VARIABLES GLOBALES ==========
let profesorActual = null;

// ========== FUNCIONES GENERALES ==========

// Mostrar mensaje al usuario
function mostrarMensaje(elementId, mensaje, tipo = 'success') {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = `mensaje ${tipo}`;
        elemento.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// Limpiar formulario
function limpiarFormulario(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// ========== FUNCIONES PARA REGISTRAR PROFESOR ==========

// Guardar profesor (Registrar)
async function guardarProfesor() {
    const numeroControl = document.getElementById('numero_de_control_ingresar')?.value.trim();
    const nombre = document.getElementById('nombre_ingresar')?.value.trim();
    const especialidad = document.getElementById('especialidad_ingresar')?.value.trim();
    
    // Validaciones básicas
    if (!numeroControl || !nombre || !especialidad) {
        mostrarMensaje('mensaje-ingresar', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numero_de_control: numeroControl,
                nombre: nombre,
                especialidad: especialidad
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-ingresar', result.message, 'success');
            limpiarFormulario('formulario-ingresar');
        } else {
            mostrarMensaje('mensaje-ingresar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al guardar profesor:', error);
        mostrarMensaje('mensaje-ingresar', 'Error de conexión con el servidor', 'error');
    }
}

// ========== FUNCIONES PARA BUSCAR PROFESOR ==========

// Buscar profesor (para Buscar_profesores.html)
async function buscarProfesor() {
    const numeroControl = document.getElementById('busqueda-numero')?.value.trim();
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-busqueda', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/buscar/${numeroControl}`);
        const result = await response.json();
        
        const resultadosDiv = document.getElementById('resultados-busqueda');
        const datosDiv = document.getElementById('datos-profesor');
        
        if (result.success) {
            const profesor = result.profesor;
            datosDiv.innerHTML = `
                <table class="tabla-profesor">
                    <tr>
                        <th>Número de Control</th>
                        <td>${profesor.numero_de_control}</td>
                    </tr>
                    <tr>
                        <th>Nombre</th>
                        <td>${profesor.nombre}</td>
                    </tr>
                    <tr>
                        <th>Especialidad</th>
                        <td>${profesor.especialidad}</td>
                    </tr>
                </table>
            `;
            resultadosDiv.style.display = 'block';
            mostrarMensaje('mensaje-busqueda', 'Profesor encontrado', 'success');
        } else {
            datosDiv.innerHTML = '';
            resultadosDiv.style.display = 'none';
            mostrarMensaje('mensaje-busqueda', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al buscar profesor:', error);
        mostrarMensaje('mensaje-busqueda', 'Error de conexión con el servidor', 'error');
    }
}

// Buscar para eliminar (para Eliminar_profesores.html)
async function buscarProfesorEliminar() {
    const numeroControl = document.getElementById('eliminar-numero')?.value.trim();
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-eliminar', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/buscar/${numeroControl}`);
        const result = await response.json();
        
        const datosDiv = document.getElementById('datos-profesor');
        const infoDiv = document.getElementById('info-profesor');
        const confirmarBtn = document.getElementById('btn-eliminar-confirmar');
        
        if (result.success) {
            profesorActual = result.profesor;
            infoDiv.innerHTML = `
                <table class="tabla-profesor">
                    <tr>
                        <th>Número de Control</th>
                        <td>${profesorActual.numero_de_control}</td>
                    </tr>
                    <tr>
                        <th>Nombre</th>
                        <td>${profesorActual.nombre}</td>
                    </tr>
                    <tr>
                        <th>Especialidad</th>
                        <td>${profesorActual.especialidad}</td>
                    </tr>
                </table>
                <p style="color: red; margin-top: 10px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    ¿Está seguro que desea eliminar este profesor?
                </p>
            `;
            datosDiv.style.display = 'block';
            confirmarBtn.style.display = 'block';
            mostrarMensaje('mensaje-eliminar', 'Profesor encontrado', 'success');
        } else {
            datosDiv.style.display = 'none';
            confirmarBtn.style.display = 'none';
            mostrarMensaje('mensaje-eliminar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al buscar profesor:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexión con el servidor', 'error');
    }
}

// Eliminar profesor confirmado
async function eliminarProfesorConfirmado() {
    if (!profesorActual) {
        mostrarMensaje('mensaje-eliminar', 'No hay profesor seleccionado', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/eliminar/${profesorActual.numero_de_control}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-eliminar', result.message, 'success');
            
            // Limpiar formulario y ocultar sección
            document.getElementById('eliminar-numero').value = '';
            document.getElementById('datos-profesor').style.display = 'none';
            document.getElementById('btn-eliminar-confirmar').style.display = 'none';
            profesorActual = null;
        } else {
            mostrarMensaje('mensaje-eliminar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexión con el servidor', 'error');
    }
}

// ========== FUNCIONES PARA ACTUALIZAR PROFESOR ==========

// Buscar profesor para actualizar
async function buscarProfesorActualizar() {
    const numeroControl = document.getElementById('actualizar-numero')?.value.trim();
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-actualizar', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/buscar/${numeroControl}`);
        const result = await response.json();
        
        const formulario = document.getElementById('formulario-actualizar');
        
        if (result.success) {
            profesorActual = result.profesor;
            
            // Llenar formulario con datos actuales
            document.getElementById('numero_original').value = profesorActual.numero_de_control;
            document.getElementById('nombre_actualizar').value = profesorActual.nombre;
            document.getElementById('especialidad_actualizar').value = profesorActual.especialidad;
            
            // Mostrar formulario
            formulario.style.display = 'block';
            mostrarMensaje('mensaje-actualizar', 'Profesor encontrado. Puede modificar los datos.', 'success');
        } else {
            formulario.style.display = 'none';
            mostrarMensaje('mensaje-actualizar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al buscar profesor:', error);
        mostrarMensaje('mensaje-actualizar', 'Error de conexión con el servidor', 'error');
    }
}

// Actualizar profesor
async function actualizarProfesor() {
    const numeroOriginal = document.getElementById('numero_original')?.value;
    const nombre = document.getElementById('nombre_actualizar')?.value.trim();
    const especialidad = document.getElementById('especialidad_actualizar')?.value.trim();
    
    if (!numeroOriginal || !nombre || !especialidad) {
        mostrarMensaje('mensaje-actualizar', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/actualizar/${numeroOriginal}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                especialidad: especialidad
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-actualizar', result.message, 'success');
            
            // Limpiar y ocultar formulario después de actualizar
            setTimeout(() => {
                document.getElementById('actualizar-numero').value = '';
                document.getElementById('formulario-actualizar').style.display = 'none';
                document.getElementById('formulario-actualizar').reset();
                profesorActual = null;
            }, 2000);
        } else {
            mostrarMensaje('mensaje-actualizar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al actualizar profesor:', error);
        mostrarMensaje('mensaje-actualizar', 'Error de conexión con el servidor', 'error');
    }
}

// ========== EVENT LISTENERS AL CARGAR PÁGINA ==========
document.addEventListener('DOMContentLoaded', function() {
    // Registrar profesores - Botón Guardar
    const btnGuardar = document.querySelector('.btn-success[onclick="guardarProfesor()"]');
    if (btnGuardar) {
        // Ya tiene onclick en el HTML, no necesita event listener adicional
    }
    
    // Buscar profesores - Botón Buscar
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarProfesor);
    }
    
    // Eliminar profesores - Botón Buscar
    const btnBuscarEliminar = document.getElementById('btn-buscar-eliminar');
    if (btnBuscarEliminar) {
        btnBuscarEliminar.addEventListener('click', buscarProfesorEliminar);
    }
    
    // Eliminar profesores - Botón Confirmar Eliminación
    const btnConfirmarEliminar = document.getElementById('btn-eliminar-confirmar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', eliminarProfesorConfirmado);
    }
    
    // Actualizar profesores - Botón Buscar
    const btnBuscarActualizar = document.getElementById('btn-buscar-actualizar');
    if (btnBuscarActualizar) {
        btnBuscarActualizar.addEventListener('click', buscarProfesorActualizar);
    }
    
    // Actualizar profesores - Botón Actualizar
    const btnActualizar = document.querySelector('.btn-success[onclick="actualizarProfesor()"]');
    if (btnActualizar) {
        // Ya tiene onclick en el HTML
    }
});

// ========== FUNCIONES PARA DEBUG ==========
// Si algo no funciona, verifica que las funciones estén disponibles globalmente
console.log('profesores.js cargado correctamente');
console.log('API URL:', API_BASE_URL);