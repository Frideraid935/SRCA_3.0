// salones.js (para otras operaciones)
const API_BASE = window.location.origin + '/api/salones';

// Función para mostrar mensajes
function mostrarMensaje(elementId, mensaje, tipo = 'success') {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = 'mensaje mensaje-' + tipo;
        elemento.style.display = 'block';
        
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// Registrar salón
window.guardarSalon = async function() {
    const nombre = document.getElementById('nombre_salon').value.trim();
    const capacidad = document.getElementById('capacidad_salon').value.trim();
    const profesorId = document.getElementById('profesor_id_salon').value.trim();
    
    if (!nombre || !capacidad || !profesorId) {
        mostrarMensaje('mensaje-salones', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (isNaN(capacidad)) {
        mostrarMensaje('mensaje-salones', 'La capacidad debe ser un número', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/registrar`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                capacidad: parseInt(capacidad),
                profesor_id: profesorId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-salones', result.message, 'success');
            document.getElementById('formulario-salones').reset();
        } else {
            mostrarMensaje('mensaje-salones', result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-salones', 'Error de conexión: ' + error.message, 'error');
    }
};

// Eliminar salón
window.eliminarSalon = async function() {
    const id = document.getElementById('eliminar_id_salon').value.trim();
    
    if (!id) {
        mostrarMensaje('mensaje-eliminar-salon', 'Ingrese un ID de salón', 'error');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar este salón?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/eliminar/${id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarMensaje('mensaje-eliminar-salon', result.message, 'success');
            document.getElementById('formulario-eliminar-salon').reset();
        } else {
            mostrarMensaje('mensaje-eliminar-salon', result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-eliminar-salon', 'Error de conexión: ' + error.message, 'error');
    }
};