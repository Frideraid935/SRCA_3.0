// JS/profesores.js
const API_BASE = '/api/profesores';

// Función para mostrar mensajes
function mostrarMensaje(elementId, mensaje, tipo = 'success') {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = `mensaje mensaje-${tipo}`;
        elemento.style.display = 'block';
        
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// ========== REGISTRAR PROFESOR ==========
window.guardarProfesor = async function() {
    const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
    const nombre = document.getElementById('nombre_ingresar').value.trim();
    const especialidad = document.getElementById('especialidad_ingresar').value.trim();
    
    if (!numeroControl || !nombre || !especialidad) {
        mostrarMensaje('mensaje-ingresar', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numero_de_control: numeroControl,
                nombre: nombre,
                especialidad: especialidad
            })
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
};

// ========== BUSCAR PROFESOR ==========
window.buscarProfesor = async function() {
    const numeroControl = document.getElementById('busqueda-numero').value.trim();
    const resultadosDiv = document.getElementById('resultados-busqueda');
    const datosDiv = document.getElementById('datos-profesor');
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-busqueda', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/buscar/${numeroControl}`);
        const result = await response.json();
        
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
        console.error('Error:', error);
        mostrarMensaje('mensaje-busqueda', 'Error de conexión', 'error');
    }
};

// ========== BUSCAR PARA ACTUALIZAR ==========
window.buscarProfesorActualizar = async function() {
    const numeroControl = document.getElementById('actualizar-numero').value.trim();
    const formulario = document.getElementById('formulario-actualizar');
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-actualizar', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/buscar/${numeroControl}`);
        const result = await response.json();
        
        if (result.success) {
            const profesor = result.profesor;
            document.getElementById('numero_original').value = profesor.numero_de_control;
            document.getElementById('nombre_actualizar').value = profesor.nombre;
            document.getElementById('especialidad_actualizar').value = profesor.especialidad;
            
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
};

// ========== ACTUALIZAR PROFESOR ==========
window.actualizarProfesor = async function() {
    const numeroOriginal = document.getElementById('numero_original').value;
    const nombre = document.getElementById('nombre_actualizar').value.trim();
    const especialidad = document.getElementById('especialidad_actualizar').value.trim();
    
    if (!numeroOriginal || !nombre || !especialidad) {
        mostrarMensaje('mensaje-actualizar', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/actualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numero_de_control: numeroOriginal,
                nombre: nombre,
                especialidad: especialidad
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-actualizar', result.message, 'success');
            
            setTimeout(() => {
                document.getElementById('actualizar-numero').value = '';
                document.getElementById('formulario-actualizar').style.display = 'none';
                document.getElementById('formulario-actualizar').reset();
            }, 2000);
        } else {
            mostrarMensaje('mensaje-actualizar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-actualizar', 'Error de conexión', 'error');
    }
};

// ========== ELIMINAR PROFESOR ==========
window.buscarProfesorEliminar = async function() {
    const numeroControl = document.getElementById('eliminar-numero').value.trim();
    const datosDiv = document.getElementById('datos-profesor');
    const infoDiv = document.getElementById('info-profesor');
    const confirmarBtn = document.getElementById('btn-eliminar-confirmar');
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-eliminar', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/buscar/${numeroControl}`);
        const result = await response.json();
        
        if (result.success) {
            const profesor = result.profesor;
            infoDiv.innerHTML = `
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
            datosDiv.style.display = 'block';
            confirmarBtn.style.display = 'block';
            confirmarBtn.dataset.numero = profesor.numero_de_control;
            
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
};

window.eliminarProfesorConfirmado = async function() {
    const numeroControl = document.getElementById('btn-eliminar-confirmar').dataset.numero;
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-eliminar', 'No hay profesor seleccionado', 'error');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar este profesor?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/eliminar`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero_de_control: numeroControl })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-eliminar', result.message, 'success');
            
            document.getElementById('eliminar-numero').value = '';
            document.getElementById('datos-profesor').style.display = 'none';
            document.getElementById('btn-eliminar-confirmar').style.display = 'none';
            document.getElementById('info-profesor').innerHTML = '';
        } else {
            mostrarMensaje('mensaje-eliminar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexión', 'error');
    }
};