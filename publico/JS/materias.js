// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ JS de materias cargado');
    
    // ========== CONFIGURACIÓN PARA REGISTRAR MATERIA ==========
    const formRegistrar = document.getElementById('formulario-ingresar');
    if (formRegistrar) {
        console.log('📝 Formulario de registro detectado');
        
        formRegistrar.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
        
        // Configurar el botón de reset
        const btnReset = formRegistrar.querySelector('button[type="reset"]');
        if (btnReset) {
            btnReset.addEventListener('click', function() {
                console.log('🧹 Formulario limpiado');
                ocultarMensaje('mensaje-ingresar');
            });
        }
    }
    
    // ========== CONFIGURACIÓN PARA ELIMINAR MATERIA ==========
    const formBuscar = document.getElementById('form-buscar-materia');
    if (formBuscar) {
        console.log('🗑️ Formulario de eliminar detectado');
        
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

// ========== FUNCIÓN PARA REGISTRAR MATERIA ==========
function registrarMateria() {
    // Obtener elementos
    const inputNombre = document.getElementById('materia-nombre');
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    
    // Validar que existan los elementos
    if (!inputNombre || !btnGuardar) {
        mostrarMensaje('mensaje-ingresar', 'Error: Elementos del formulario no encontrados', 'error');
        return;
    }
    
    // Obtener y validar nombre
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        mostrarMensaje('mensaje-ingresar', 'El nombre de la materia es obligatorio', 'warning');
        inputNombre.focus();
        return;
    }
    
    // Guardar estado original del botón
    const textoOriginal = btnGuardar.innerHTML;
    const estadoOriginal = btnGuardar.disabled;
    
    // Cambiar estado del botón
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Preparar datos
    const datos = { 
        nombre: nombre 
        // NOTA: El campo 'materia-id' es opcional, no lo enviamos
    };
    
    console.log('📤 Enviando datos de registro:', datos);
    
    // Enviar petición
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('📥 Status de respuesta:', response.status);
        
        // Intentar parsear la respuesta como JSON
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }
            return data;
        });
    })
    .then(data => {
        console.log('✅ Respuesta del servidor:', data);
        
        if (data.success) {
            // Éxito
            mostrarMensaje('mensaje-ingresar', data.message, 'success');
            
            // Limpiar formulario
            inputNombre.value = '';
            const inputId = document.getElementById('materia-id');
            if (inputId) inputId.value = '';
            
            // Enfocar campo de nombre para nuevo registro
            inputNombre.focus();
        } else {
            // Error del servidor
            mostrarMensaje('mensaje-ingresar', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Error en registro:', error);
        mostrarMensaje('mensaje-ingresar', 
            error.message.includes('Failed to fetch') 
                ? 'Error de conexión con el servidor' 
                : error.message, 
            'error'
        );
    })
    .finally(() => {
        // IMPORTANTE: SIEMPRE restaurar el botón
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        console.log('🔄 Botón de registro restaurado');
    });
}

// ========== FUNCIONES PARA ELIMINAR MATERIA ==========
function buscarMateriaParaEliminar() {
    // Obtener elementos
    const inputBuscar = document.getElementById('buscar-nombre');
    const btnBuscar = document.querySelector('#form-buscar-materia button[type="submit"]');
    
    // Validar que existan los elementos
    if (!inputBuscar || !btnBuscar) {
        mostrarMensaje('mensaje-eliminar', 'Error: Elementos no encontrados', 'error');
        return;
    }
    
    // Obtener y validar nombre de búsqueda
    const nombre = inputBuscar.value.trim();
    if (!nombre) {
        mostrarMensaje('mensaje-eliminar', 'Escribe el nombre de la materia que deseas eliminar', 'warning');
        inputBuscar.focus();
        return;
    }
    
    // Guardar estado original del botón
    const textoOriginal = btnBuscar.innerHTML;
    
    // Cambiar estado del botón
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    
    // Ocultar información anterior
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    console.log('🔍 Buscando materia:', nombre);
    
    // Realizar búsqueda
    fetch(`${API_BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('📥 Resultado de búsqueda:', data);
        
        if (data.success) {
            // Éxito: mostrar materia encontrada
            mostrarMateriaEncontrada(data.materia);
            mostrarMensaje('mensaje-eliminar', data.message, 'success');
        } else {
            // Error: materia no encontrada
            mostrarMensaje('mensaje-eliminar', data.message, 'warning');
        }
    })
    .catch(error => {
        console.error('❌ Error en búsqueda:', error);
        mostrarMensaje('mensaje-eliminar', 
            error.message.includes('Failed to fetch') 
                ? 'Error de conexión con el servidor' 
                : 'Error al buscar la materia', 
            'error'
        );
    })
    .finally(() => {
        // Restaurar botón
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = textoOriginal;
    });
}

function mostrarMateriaEncontrada(materia) {
    console.log('📋 Mostrando materia encontrada:', materia);
    
    // Actualizar información en la página
    document.getElementById('info-id').textContent = materia.id;
    document.getElementById('info-nombre').textContent = materia.nombre;
    
    // Mostrar el div de información
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'block';
        
        // Desplazar vista para que se vea
        infoDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function confirmarEliminacion() {
    // Obtener información de la materia
    const idElement = document.getElementById('info-id');
    const nombreElement = document.getElementById('info-nombre');
    
    if (!idElement || !nombreElement) {
        mostrarMensaje('mensaje-eliminar', 'Error: Información no disponible', 'error');
        return;
    }
    
    const id = idElement.textContent.trim();
    const nombre = nombreElement.textContent.trim();
    
    // Validar que haya información
    if (!id || !nombre || id === '' || nombre === '') {
        mostrarMensaje('mensaje-eliminar', 'Primero debes buscar una materia', 'warning');
        return;
    }
    
    // Confirmación DOBLE
    if (!confirm(`¿ESTÁS ABSOLUTAMENTE SEGURO DE ELIMINAR ESTA MATERIA?\n\n📚 MATERIA: ${nombre}\n🆔 ID: ${id}\n\n⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER.`)) {
        console.log('❌ Eliminación cancelada por el usuario');
        return;
    }
    
    // Obtener botón de confirmación
    const btnConfirmar = document.querySelector('#form-confirmar-eliminar button[type="submit"]');
    const textoOriginal = btnConfirmar.innerHTML;
    
    // Cambiar estado del botón
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
    
    console.log('🗑️ Enviando solicitud de eliminación para ID:', id);
    
    // Enviar solicitud de eliminación
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Respuesta de eliminación:', data);
        
        if (data.success) {
            // Éxito
            mostrarMensaje('mensaje-eliminar', data.message, 'success');
            
            // Limpiar todo el formulario
            limpiarFormularioEliminar();
            
            // Mostrar alerta final
            setTimeout(() => {
                alert(`✅ Materia eliminada exitosamente:\n\n"${nombre}"`);
            }, 300);
        } else {
            // Error del servidor
            mostrarMensaje('mensaje-eliminar', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('❌ Error en eliminación:', error);
        mostrarMensaje('mensaje-eliminar', 
            error.message.includes('Failed to fetch') 
                ? 'Error de conexión con el servidor' 
                : 'Error al eliminar la materia', 
            'error'
        );
    })
    .finally(() => {
        // Restaurar botón
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = textoOriginal;
    });
}

function limpiarFormularioEliminar() {
    console.log('🧹 Limpiando formulario de eliminación');
    
    // Limpiar campo de búsqueda
    const inputBuscar = document.getElementById('buscar-nombre');
    if (inputBuscar) {
        inputBuscar.value = '';
    }
    
    // Ocultar información de materia
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    // Limpiar datos mostrados
    document.getElementById('info-id').textContent = '';
    document.getElementById('info-nombre').textContent = '';
    
    // Enfocar campo de búsqueda para nueva búsqueda
    if (inputBuscar) {
        inputBuscar.focus();
    }
}

// ========== FUNCIONES AUXILIARES ==========
function mostrarMensaje(elementId, texto, tipo) {
    const mensajeDiv = document.getElementById(elementId);
    if (!mensajeDiv) {
        console.warn(`⚠️ Elemento #${elementId} no encontrado`);
        return;
    }
    
    // Determinar clase CSS según tipo
    let claseCss = '';
    switch(tipo) {
        case 'success':
            claseCss = 'mensaje-success';
            break;
        case 'error':
            claseCss = 'mensaje-error';
            break;
        case 'warning':
            claseCss = 'mensaje-warning';
            break;
        default:
            claseCss = 'mensaje-info';
    }
    
    // Actualizar contenido
    mensajeDiv.innerHTML = `
        <div class="${claseCss}">
            ${texto}
        </div>
    `;
    mensajeDiv.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos (excepto success)
    if (tipo !== 'success') {
        setTimeout(() => {
            if (mensajeDiv.innerHTML.includes(texto)) {
                mensajeDiv.innerHTML = '';
                mensajeDiv.style.display = 'none';
            }
        }, 5000);
    }
}

function ocultarMensaje(elementId) {
    const mensajeDiv = document.getElementById(elementId);
    if (mensajeDiv) {
        mensajeDiv.innerHTML = '';
        mensajeDiv.style.display = 'none';
    }
}

// ========== EXPORTAR FUNCIONES PARA HTML ==========
// Esto permite llamar a las funciones desde onclick en HTML si es necesario
window.registrarMateria = registrarMateria;
window.buscarMateriaParaEliminar = buscarMateriaParaEliminar;
window.confirmarEliminacion = confirmarEliminacion;