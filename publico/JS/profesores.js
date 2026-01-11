// profesores.js - Frontend JavaScript para profesores

const API_BASE_URL = window.location.origin + '/api/profesores';
let profesorActual = null;

function mostrarMensaje(elementId, mensaje, tipo = 'success') {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = `mensaje ${tipo}`;
        elemento.style.display = 'block';
        setTimeout(() => elemento.style.display = 'none', 5000);
    }
}

async function guardarProfesor() {
    const numeroControl = document.getElementById('numero_de_control_ingresar')?.value.trim();
    const nombre = document.getElementById('nombre_ingresar')?.value.trim();
    const especialidad = document.getElementById('especialidad_ingresar')?.value.trim();
    
    if (!numeroControl || !nombre || !especialidad) {
        mostrarMensaje('mensaje-ingresar', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/registrar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({numero_de_control: numeroControl, nombre, especialidad})
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-ingresar', result.message, 'success');
            document.getElementById('formulario-ingresar').reset();
        } else {
            mostrarMensaje('mensaje-ingresar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-ingresar', 'Error de conexión', 'error');
    }
}

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
                    <tr><th>Número de Control</th><td>${profesor.numero_de_control}</td></tr>
                    <tr><th>Nombre</th><td>${profesor.nombre}</td></tr>
                    <tr><th>Especialidad</th><td>${profesor.especialidad}</td></tr>
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
        console.error('Error:', error);
        mostrarMensaje('mensaje-busqueda', 'Error de conexión', 'error');
    }
}

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
                    <tr><th>Número de Control</th><td>${profesorActual.numero_de_control}</td></tr>
                    <tr><th>Nombre</th><td>${profesorActual.nombre}</td></tr>
                    <tr><th>Especialidad</th><td>${profesorActual.especialidad}</td></tr>
                </table>
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
        console.error('Error:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexión', 'error');
    }
}

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
            document.getElementById('eliminar-numero').value = '';
            document.getElementById('datos-profesor').style.display = 'none';
            document.getElementById('btn-eliminar-confirmar').style.display = 'none';
            profesorActual = null;
        } else {
            mostrarMensaje('mensaje-eliminar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexión', 'error');
    }
}

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
            document.getElementById('numero_original').value = profesorActual.numero_de_control;
            document.getElementById('nombre_actualizar').value = profesorActual.nombre;
            document.getElementById('especialidad_actualizar').value = profesorActual.especialidad;
            formulario.style.display = 'block';
            mostrarMensaje('mensaje-actualizar', 'Profesor encontrado', 'success');
        } else {
            formulario.style.display = 'none';
            mostrarMensaje('mensaje-actualizar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-actualizar', 'Error de conexión', 'error');
    }
}

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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nombre, especialidad})
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-actualizar', result.message, 'success');
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
        console.error('Error:', error);
        mostrarMensaje('mensaje-actualizar', 'Error de conexión', 'error');
    }
}