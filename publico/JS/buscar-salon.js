// buscar-salon.js - VERSIÓN FINAL CORREGIDA
console.log('✅ buscar-salon.js cargado');

const API_SALONES = '/api/salones';

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Sistema de búsqueda de salones listo');
    
    const formBuscar = document.getElementById('formulario-buscar-salon');
    if (formBuscar) {
        formBuscar.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🖱️ Formulario enviado');
            buscarSalon();
        });
        console.log('✅ Formulario configurado');
    }
});

// Función principal CORREGIDA
async function buscarSalon() {
    console.log('🚀 Iniciando búsqueda...');
    
    // Obtener elementos
    const idInput = document.getElementById('id_salon_buscar');
    const mensajeDiv = document.getElementById('mensaje-busqueda');
    const resultadoDiv = document.getElementById('resultado-salon');
    const datosDiv = document.getElementById('datos-salon');
    
    if (!idInput || !mensajeDiv || !resultadoDiv || !datosDiv) {
        console.error('❌ Elementos no encontrados');
        return;
    }
    
    const id = idInput.value.trim();
    console.log('ID a buscar:', id);
    
    if (!id) {
        mensajeDiv.textContent = 'Ingrese un ID de salón';
        mensajeDiv.style.color = 'red';
        mensajeDiv.style.display = 'block';
        return;
    }
    
    // Mostrar "buscando..."
    mensajeDiv.textContent = 'Buscando salón...';
    mensajeDiv.style.color = 'blue';
    mensajeDiv.style.display = 'block';
    resultadoDiv.style.display = 'none';
    datosDiv.innerHTML = '';
    
    try {
        // TIMEOUT DE 8 SEGUNDOS - Esto evita "pending"
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            console.error('⏰ TIMEOUT: La petición tardó demasiado');
        }, 8000);
        
        // Hacer petición con timeout
        const response = await fetch(`${API_SALONES}/buscar/${id}`, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        console.log('📡 Status:', response.status, response.statusText);
        
        // Verificar si la respuesta es OK
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📦 Datos recibidos:', result);
        
        // Mostrar resultados
        if (result.success && result.salon) {
            datosDiv.innerHTML = `
                <div style="background:#d4edda; padding:15px; border-radius:5px;">
                    <p><strong>ID:</strong> ${result.salon.id}</p>
                    <p><strong>Nombre:</strong> ${result.salon.nombre}</p>
                    <p><strong>Capacidad:</strong> ${result.salon.capacidad} personas</p>
                    <p><strong>Profesor ID:</strong> ${result.salon.profesor_id}</p>
                </div>
            `;
            resultadoDiv.style.display = 'block';
            mensajeDiv.textContent = '✅ Salón encontrado';
            mensajeDiv.style.color = 'green';
        } else {
            mensajeDiv.textContent = result.message || 'Salón no encontrado';
            mensajeDiv.style.color = 'red';
        }
        
    } catch (error) {
        console.error('🔥 Error:', error);
        
        let mensajeError = 'Error al buscar salón';
        
        if (error.name === 'AbortError') {
            mensajeError = '⏰ Timeout: El servidor no respondió. Verifica:';
            mensajeError += '\n1. Que la ruta /api/salones/buscar/ exista';
            mensajeError += '\n2. Que el servidor esté corriendo';
            mensajeError += '\n3. Que no haya errores en el controlador';
        } else if (error.message.includes('Failed to fetch')) {
            mensajeError = '🌐 Error de red: No se pudo conectar al servidor';
        } else {
            mensajeError = error.message;
        }
        
        mensajeDiv.textContent = mensajeError;
        mensajeDiv.style.color = 'red';
        mensajeDiv.style.whiteSpace = 'pre-line';
        
        // Mostrar ayuda en consola
        console.log('💡 Para diagnosticar, prueba en consola:');
        console.log(`fetch('${API_SALONES}/buscar/1').then(r => console.log(r.status)).catch(err => console.error(err))`);
    }
}

// Función global para pruebas
window.buscarSalon = buscarSalon;