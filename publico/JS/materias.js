// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ JS de materias cargado');
    
    // Configurar REGISTRAR
    const formRegistrar = document.getElementById('formulario-ingresar');
    if (formRegistrar) {
        console.log('📝 Formulario de registro encontrado');
        formRegistrar.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // Configurar ELIMINAR
    const formBuscar = document.getElementById('form-buscar-materia');
    if (formBuscar) {
        console.log('🗑️ Formulario de eliminar encontrado');
        formBuscar.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarMateriaParaEliminar();
        });
    }
    
    const formConfirmar = document.getElementById('form-confirmar-eliminar');
    if (formConfirmar) {
        formConfirmar.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmarEliminacion();
        });
    }
});

// ========== REGISTRAR MATERIA ==========
function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    
    if (!inputNombre || !btnGuardar) {
        mostrarMensajeSimple('Error: Elementos no encontrados', 'error');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        mostrarMensajeSimple('El nombre es obligatorio', 'warning');
        inputNombre.focus();
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnGuardar.innerHTML;
    
    // Cambiar estado
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { nombre: nombre };
    
    console.log('📤 Enviando registro:', datos);
    
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('📥 Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('✅ Respuesta:', data);
        
        if (data.success) {
            mostrarMensajeSimple(data.message, 'success');
            inputNombre.value = '';
            
            // Limpiar campo ID si existe
            const inputId = document.getElementById('materia-id');
            if (inputId) inputId.value = '';
            
            inputNombre.focus();
        } else {
            mostrarMensajeSimple(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Error:', error);
        mostrarMensajeSimple('Error de conexión', 'error');
    })
    .finally(() => {
        // SIEMPRE RESTAURAR
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
    });
}

// ========== ELIMINAR MATERIA ==========
function buscarMateriaParaEliminar() {
    const inputBuscar = document.getElementById('buscar-nombre');
    const btnBuscar = document.querySelector('#form-buscar-materia button[type="submit"]');
    
    if (!inputBuscar || !btnBuscar) {
        mostrarMensaje('mensaje-eliminar', 'Error: Elementos no encontrados', 'error');
        return;
    }
    
    const nombre = inputBuscar.value.trim();
    if (!nombre) {
        mostrarMensaje('mensaje-eliminar', 'Escribe el nombre de la materia', 'warning');
        inputBuscar.focus();
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnBuscar.innerHTML;
    
    // Cambiar estado
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    
    // Ocultar información anterior
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) infoDiv.style.display = 'none';
    
    // Limpiar mensajes
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    if (mensajeDiv) mensajeDiv.innerHTML = '';
    
    console.log('🔍 Buscando:', nombre);
    
    // URL CORREGIDA - usar encodeURIComponent
    const url = `${API_BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`;
    console.log('🔍 URL:', url);
    
    // Hacer petición con timeout
    const timeout = 10000; // 10 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    fetch(url, {
        signal: controller.signal
    })
    .then(response => {
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('🔍 Resultado:', data);
        
        if (data.success) {
            // ÉXITO: Mostrar materia
            mostrarMateriaEncontrada(data.materia);
            mostrarMensaje('mensaje-eliminar', '✅ ' + data.message, 'success');
        } else {
            // ERROR: No encontrada
            mostrarMensaje('mensaje-eliminar', '❌ ' + data.message, 'warning');
        }
    })
    .catch(error => {
        clearTimeout(timeoutId);
        console.error('❌ Error búsqueda:', error);
        
        if (error.name === 'AbortError') {
            mostrarMensaje('mensaje-eliminar', '⏱️ Tiempo de espera agotado', 'error');
        } else if (error.message.includes('Failed to fetch')) {
            mostrarMensaje('mensaje-eliminar', '🔌 Error de conexión', 'error');
        } else {
            mostrarMensaje('mensaje-eliminar', '❌ Error: ' + error.message, 'error');
        }
    })
    .finally(() => {
        // Restaurar botón
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = textoOriginal;
    });
}

function mostrarMateriaEncontrada(materia) {
    console.log('📋 Mostrando materia:', materia);
    
    // Actualizar información
    document.getElementById('info-id').textContent = materia.id;
    document.getElementById('info-nombre').textContent = materia.nombre;
    
    // Mostrar contenedor
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'block';
        
        // Desplazar vista
        setTimeout(() => {
            infoDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
}

function confirmarEliminacion() {
    const id = document.getElementById('info-id').textContent.trim();
    const nombre = document.getElementById('info-nombre').textContent.trim();
    
    if (!id || id === '') {
        mostrarMensaje('mensaje-eliminar', 'Primero busca una materia', 'warning');
        return;
    }
    
    // Confirmación
    const confirmacion = confirm(`¿ELIMINAR ESTA MATERIA?\n\n📚 ${nombre}\n🆔 ${id}\n\n⚠️ Esta acción no se puede deshacer.`);
    if (!confirmacion) {
        console.log('❌ Cancelado por usuario');
        return;
    }
    
    const btnConfirmar = document.querySelector('#form-confirmar-eliminar button[type="submit"]');
    const textoOriginal = btnConfirmar.innerHTML;
    
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
    
    console.log('🗑️ Eliminando ID:', id);
    
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Respuesta eliminación:', data);
        
        if (data.success) {
            mostrarMensaje('mensaje-eliminar', '✅ ' + data.message, 'success');
            limpiarFormularioEliminar();
            
            // Mostrar alerta final
            setTimeout(() => {
                alert('✅ Materia eliminada:\n' + nombre);
            }, 500);
        } else {
            mostrarMensaje('mensaje-eliminar', '❌ ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Error:', error);
        mostrarMensaje('mensaje-eliminar', '❌ Error de conexión', 'error');
    })
    .finally(() => {
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = textoOriginal;
    });
}

function limpiarFormularioEliminar() {
    // Limpiar campo de búsqueda
    const inputBuscar = document.getElementById('buscar-nombre');
    if (inputBuscar) inputBuscar.value = '';
    
    // Ocultar información
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) infoDiv.style.display = 'none';
    
    // Limpiar datos
    document.getElementById('info-id').textContent = '';
    document.getElementById('info-nombre').textContent = '';
    
    // Limpiar mensajes
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    if (mensajeDiv) mensajeDiv.innerHTML = '';
    
    // Enfocar campo
    if (inputBuscar) inputBuscar.focus();
}

// ========== FUNCIONES AUXILIARES ==========
function mostrarMensaje(elementId, texto, tipo) {
    const mensajeDiv = document.getElementById(elementId);
    if (!mensajeDiv) {
        console.warn('⚠️ Elemento no encontrado:', elementId);
        alert(texto); // Fallback
        return;
    }
    
    let color = '#333';
    let icono = '';
    
    switch(tipo) {
        case 'success':
            color = '#28a745';
            icono = '✅';
            break;
        case 'error':
            color = '#dc3545';
            icono = '❌';
            break;
        case 'warning':
            color = '#ffc107';
            icono = '⚠️';
            break;
        default:
            color = '#17a2b8';
            icono = 'ℹ️';
    }
    
    mensajeDiv.innerHTML = `
        <div style="padding: 10px; margin: 10px 0; border-left: 4px solid ${color}; background: ${color}15; color: ${color};">
            ${icono} ${texto}
        </div>
    `;
    mensajeDiv.style.display = 'block';
    
    // Auto-ocultar
    if (tipo !== 'success') {
        setTimeout(() => {
            if (mensajeDiv.innerHTML.includes(texto)) {
                mensajeDiv.innerHTML = '';
                mensajeDiv.style.display = 'none';
            }
        }, 5000);
    }
}

function mostrarMensajeSimple(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje-ingresar');
    if (mensajeDiv) {
        mostrarMensaje('mensaje-ingresar', texto, tipo);
    } else {
        // Fallback: alert
        alert(texto);
    }
}

// Exportar
window.registrarMateria = registrarMateria;
window.buscarMateriaParaEliminar = buscarMateriaParaEliminar;
window.confirmarEliminacion = confirmarEliminacion;