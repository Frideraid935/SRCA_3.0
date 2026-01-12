// buscar-salon.js
console.log('buscar-salon.js cargado');

const API_BASE = window.location.origin + '/api/salones';

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje-busqueda');
    if (!mensajeDiv) return;
    
    mensajeDiv.textContent = texto;
    mensajeDiv.className = 'mensaje mensaje-' + tipo;
    mensajeDiv.style.display = 'block';
    
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
}

// Función principal de búsqueda
async function buscarSalon() {
    const idInput = document.getElementById('id_salon_buscar');
    
    if (!idInput) {
        console.error('Input no encontrado');
        return;
    }
    
    const id = idInput.value.trim();
    
    if (!id) {
        mostrarMensaje('Ingrese un ID de salon', 'error');
        return;
    }
    
    if (isNaN(id)) {
        mostrarMensaje('El ID debe ser un número', 'error');
        return;
    }
    
    try {
        mostrarMensaje(`Buscando salon ID: ${id}...`, 'info');
        
        const response = await fetch(`${API_BASE}/buscar/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.salon) {
            mostrarResultado(result.salon);
            mostrarMensaje('Salon encontrado', 'success');
        } else {
            mostrarMensaje(result.message || 'Salon no encontrado', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al buscar salon: ' + error.message, 'error');
    }
}

// Función para mostrar resultados
function mostrarResultado(salon) {
    const datosDiv = document.getElementById('datos-salon');
    const resultadoDiv = document.getElementById('resultado-salon');
    
    if (!datosDiv || !resultadoDiv) return;
    
    datosDiv.innerHTML = `
        <table class="tabla-profesor">
            <tr>
                <th>ID</th>
                <td>${salon.id}</td>
            </tr>
            <tr>
                <th>Nombre</th>
                <td>${salon.nombre}</td>
            </tr>
            <tr>
                <th>Capacidad</th>
                <td>${salon.capacidad} personas</td>
            </tr>
            <tr>
                <th>Profesor Asignado</th>
                <td>${salon.profesor_id || 'No asignado'}</td>
            </tr>
        </table>
    `;
    
    resultadoDiv.style.display = 'block';
}

// Configurar evento cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Buscador listo');
    
    const form = document.getElementById('formulario-buscar-salon');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarSalon();
        });
    }
});

// Función global para limpiar (ya existe en HTML)
function limpiarBusqueda() {
    document.getElementById('id_salon_buscar').value = '';
    document.getElementById('resultado-salon').style.display = 'none';
    document.getElementById('mensaje-busqueda').style.display = 'none';
    document.getElementById('datos-salon').innerHTML = '';
}

// Función global para debug
window.probarBusqueda = function(id = 1) {
    console.clear();
    console.log('=== PRUEBA MANUAL ===');
    document.getElementById('id_salon_buscar').value = id;
    buscarSalon();
};