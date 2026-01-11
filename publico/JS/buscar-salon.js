// buscar-salon.js - VERSIÓN DEFINITIVA
console.log('🎯 buscar-salon.js - VERSIÓN FINAL');

// Configuración para Railway
const API_BASE = window.location.origin + '/api/salones';
console.log('🌐 API Base:', API_BASE);
console.log('📍 URL completa:', window.location.href);

// Función SIMPLE y DIRECTA
async function buscarSalon() {
    console.log('=== INICIANDO BÚSQUEDA ===');
    
    try {
        // 1. Obtener ID
        const idInput = document.getElementById('id_salon_buscar');
        if (!idInput) {
            console.error('❌ Input no encontrado');
            return;
        }
        
        const id = idInput.value.trim();
        console.log('ID ingresado:', id);
        
        if (!id) {
            mostrarMensaje('Ingrese un ID de salón', 'error');
            return;
        }
        
        // 2. Mostrar "buscando"
        mostrarMensaje(`Buscando salón ID: ${id}...`, 'info');
        document.getElementById('resultado-salon').style.display = 'none';
        document.getElementById('datos-salon').innerHTML = '';
        
        // 3. Hacer petición CON TIMEOUT
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            console.error('⏰ TIMEOUT: 8 segundos sin respuesta');
        }, 8000);
        
        const url = `${API_BASE}/buscar/${id}`;
        console.log('📡 Fetch URL:', url);
        
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        console.log('✅ Response recibida:', response.status, response.statusText);
        
        // 4. Verificar respuesta
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error HTTP:', response.status, errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // 5. Parsear JSON
        const result = await response.json();
        console.log('📦 JSON recibido:', result);
        
        // 6. Mostrar resultados
        if (result.success && result.salon) {
            mostrarResultado(result.salon);
            mostrarMensaje('✅ Salón encontrado', 'success');
        } else {
            mostrarMensaje(result.message || 'Salón no encontrado', 'error');
        }
        
    } catch (error) {
        console.error('🔥 ERROR COMPLETO:', error);
        
        // Mensaje según tipo de error
        let mensaje = 'Error al buscar salón';
        
        if (error.name === 'AbortError') {
            mensaje = '⏰ Timeout: El servidor no respondió en 8 segundos.';
            mensaje += '\n\nPosibles causas:';
            mensaje += '\n1. La ruta /api/salones/buscar/ no existe';
            mensaje += '\n2. El controlador tiene un error';
            mensaje += '\n3. La base de datos no responde';
        } else if (error.message.includes('Failed to fetch')) {
            mensaje = '🔌 Error de conexión: No se pudo conectar al servidor.';
            mensaje += '\n\nVerifica:';
            mensaje += '\n• Que el servidor esté corriendo';
            mensaje += '\n• Que no haya problemas de red';
        } else {
            mensaje = error.message;
        }
        
        mostrarMensaje(mensaje, 'error');
        
        // Mostrar ayuda adicional
        console.log('💡 PARA DIAGNOSTICAR:');
        console.log('1. Abre esta URL directamente:');
        console.log('   ' + window.location.origin + '/api/salones/buscar/1');
        console.log('2. Revisa los logs del servidor en Railway');
        console.log('3. Verifica que salones.api.js esté cargado');
    }
}

// Función para mostrar resultados
function mostrarResultado(salon) {
    const datosDiv = document.getElementById('datos-salon');
    const resultadoDiv = document.getElementById('resultado-salon');
    
    if (!datosDiv || !resultadoDiv) return;
    
    datosDiv.innerHTML = `
        <div style="
            background: #e8f5e9;
            padding: 20px;
            border-radius: 8px;
            border-left: 5px solid #4caf50;
            margin-top: 10px;
        ">
            <h4 style="color: #2e7d32; margin-top: 0;">✅ INFORMACIÓN DEL SALÓN</h4>
            <p><strong>ID:</strong> ${salon.id}</p>
            <p><strong>Nombre:</strong> ${salon.nombre}</p>
            <p><strong>Capacidad:</strong> ${salon.capacidad} personas</p>
            <p><strong>Número de Control del Profesor:</strong> ${salon.profesor_id}</p>
            <p style="color: #666; font-size: 12px; margin-top: 15px;">
                <em>Consultado: ${new Date().toLocaleTimeString()}</em>
            </p>
        </div>
    `;
    
    resultadoDiv.style.display = 'block';
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje-busqueda');
    if (!mensajeDiv) return;
    
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje mensaje-${tipo}`;
    mensajeDiv.style.display = 'block';
    mensajeDiv.style.whiteSpace = 'pre-line';
    
    // Colores según tipo
    const colores = {
        success: { color: '#155724', bg: '#d4edda', border: '#c3e6cb' },
        error: { color: '#721c24', bg: '#f8d7da', border: '#f5c6cb' },
        info: { color: '#0c5460', bg: '#d1ecf1', border: '#bee5eb' }
    };
    
    const color = colores[tipo] || colores.info;
    mensajeDiv.style.color = color.color;
    mensajeDiv.style.backgroundColor = color.bg;
    mensajeDiv.style.border = `1px solid ${color.border}`;
    mensajeDiv.style.padding = '12px';
    mensajeDiv.style.borderRadius = '5px';
}

// Configurar evento
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado - Buscador listo');
    
    const form = document.getElementById('formulario-buscar-salon');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarSalon();
        });
    }
    
    // Función global para debug
    window.probarBusqueda = function(id = 1) {
        console.clear();
        console.log('=== PRUEBA MANUAL ===');
        document.getElementById('id_salon_buscar').value = id;
        buscarSalon();
    };
});