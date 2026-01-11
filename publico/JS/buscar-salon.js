// buscar-salon.js - Sistema independiente para buscar salones
const API_SALONES = '/api/salones';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de búsqueda de salones cargado');
    
    // Configurar el formulario
    const formBuscar = document.getElementById('formulario-buscar-salon');
    if (formBuscar) {
        formBuscar.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarSalon();
        });
        console.log('Formulario de búsqueda configurado');
    } else {
        console.error('No se encontró el formulario con ID: formulario-buscar-salon');
    }
    
    // Prueba automática si hay parámetro en URL
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('test');
    if (testId) {
        console.log('Prueba automática con ID:', testId);
        setTimeout(() => {
            document.getElementById('id_salon_buscar').value = testId;
            buscarSalon();
        }, 500);
    }
});

// Función principal para buscar salón
async function buscarSalon() {
    // Obtener elementos
    const idInput = document.getElementById('id_salon_buscar');
    const mensajeDiv = document.getElementById('mensaje-busqueda');
    const resultadoDiv = document.getElementById('resultado-salon');
    const datosDiv = document.getElementById('datos-salon');
    
    // Validar que existan los elementos
    if (!idInput || !mensajeDiv || !resultadoDiv || !datosDiv) {
        console.error('Elementos HTML no encontrados');
        alert('Error: Elementos de la página no cargados correctamente');
        return;
    }
    
    // Obtener ID
    const id = idInput.value.trim();
    
    // Validar ID
    if (!id) {
        mostrarMensaje(mensajeDiv, 'Por favor, ingrese un ID de salón', 'error');
        resultadoDiv.style.display = 'none';
        return;
    }
    
    // Mostrar estado de búsqueda
    mostrarMensaje(mensajeDiv, 'Buscando salón...', 'info');
    resultadoDiv.style.display = 'none';
    datosDiv.innerHTML = '';
    
    try {
        // Hacer la petición a la API
        console.log(`Buscando salón con ID: ${id}`);
        const url = `${API_SALONES}/buscar/${id}`;
        console.log('URL:', url);
        
        const respuesta = await fetch(url);
        console.log('Status:', respuesta.status, respuesta.statusText);
        
        // Verificar si la respuesta es OK
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status} ${respuesta.statusText}`);
        }
        
        // Parsear la respuesta JSON
        const resultado = await respuesta.json();
        console.log('Respuesta JSON:', resultado);
        
        // Verificar si la búsqueda fue exitosa
        if (!resultado.success) {
            mostrarMensaje(mensajeDiv, resultado.message || 'Salón no encontrado', 'error');
            return;
        }
        
        // Mostrar los datos del salón
        mostrarDatosSalon(resultado.salon, datosDiv);
        resultadoDiv.style.display = 'block';
        mostrarMensaje(mensajeDiv, 'Salón encontrado correctamente', 'success');
        
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        
        let mensajeError = 'Error al buscar el salón';
        if (error.message.includes('Failed to fetch')) {
            mensajeError = 'No se pudo conectar al servidor';
        } else if (error.message.includes('HTTP')) {
            mensajeError = `Error del servidor: ${error.message}`;
        }
        
        mostrarMensaje(mensajeDiv, mensajeError, 'error');
    }
}

// Función para mostrar los datos del salón
function mostrarDatosSalon(salon, contenedor) {
    if (!salon) {
        contenedor.innerHTML = '<p class="error">No hay datos del salón</p>';
        return;
    }
    
    const html = `
        <div class="datos-item">
            <p><strong>ID:</strong> ${salon.id}</p>
            <p><strong>Nombre:</strong> ${salon.nombre}</p>
            <p><strong>Capacidad:</strong> ${salon.capacidad} personas</p>
            <p><strong>Número de Control del Profesor:</strong> ${salon.profesor_id}</p>
        </div>
    `;
    
    contenedor.innerHTML = html;
}

// Función para mostrar mensajes
function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = `mensaje mensaje-${tipo}`;
    elemento.style.display = 'block';
    
    // Ocultar mensajes después de 5 segundos (excepto info)
    if (tipo !== 'info') {
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// Función para prueba desde consola
window.buscarSalonTest = function(id = 1) {
    const input = document.getElementById('id_salon_buscar');
    if (input) {
        input.value = id;
        buscarSalon();
    } else {
        console.error('Input no encontrado');
    }
};

// Exportar para pruebas
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buscarSalon };
}