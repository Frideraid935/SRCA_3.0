// publico/JS/materias.js

// URL base para las APIs - IMPORTANTE: Ajusta según tu despliegue
let API_BASE_URL = '/api/materias';

// Si estás en Railway, la URL debería ser relativa
console.log('API URL:', API_BASE_URL);
console.log('URL actual:', window.location.origin);

document.addEventListener('DOMContentLoaded', function() {
    console.log('JS de materias cargado');
    
    // ===== CONFIGURAR REGISTRAR =====
    const formRegistrar = document.getElementById('formulario-ingresar');
    if (formRegistrar) {
        console.log('Formulario de registro encontrado');
        formRegistrar.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // ===== CONFIGURAR ELIMINAR =====
    const formBuscar = document.getElementById('form-buscar-materia');
    if (formBuscar) {
        console.log('Formulario de eliminar encontrado');
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

// ===== FUNCION PARA REGISTRAR MATERIA =====
function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    
    if (!inputNombre || !btnGuardar) {
        alert('Error: Elementos del formulario no encontrados');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre de la materia es obligatorio');
        inputNombre.focus();
        return;
    }
    
    // Guardar estado original del boton
    const textoOriginal = btnGuardar.innerHTML;
    
    // Cambiar estado del boton
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    // Preparar datos
    const datos = { 
        nombre: nombre 
    };
    
    console.log('Enviando datos de registro:', datos);
    
    // Enviar peticion
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('Status de respuesta:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        
        if (data.success) {
            alert(data.message);
            
            // Limpiar formulario
            inputNombre.value = '';
            const inputId = document.getElementById('materia-id');
            if (inputId) inputId.value = '';
            
            // Enfocar campo de nombre
            inputNombre.focus();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error en registro:', error);
        alert('Error de conexion con el servidor. Verifica tu conexion a internet.');
    })
    .finally(() => {
        // IMPORTANTE: Siempre restaurar el boton
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        console.log('Boton de registro restaurado');
    });
}

// ===== FUNCIONES PARA ELIMINAR MATERIA =====
function buscarMateriaParaEliminar() {
    const inputBuscar = document.getElementById('buscar-nombre');
    const btnBuscar = document.querySelector('#form-buscar-materia button[type="submit"]');
    
    if (!inputBuscar || !btnBuscar) {
        mostrarMensaje('mensaje-eliminar', 'Error: Elementos no encontrados', 'error');
        return;
    }
    
    const nombre = inputBuscar.value.trim();
    if (!nombre) {
        mostrarMensaje('mensaje-eliminar', 'Escribe el nombre de la materia que deseas eliminar', 'warning');
        inputBuscar.focus();
        return;
    }
    
    // Guardar estado original del boton
    const textoOriginal = btnBuscar.innerHTML;
    
    // Cambiar estado del boton
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = 'Buscando...';
    
    // Ocultar informacion anterior
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    console.log('Buscando materia:', nombre);
    
    // Construir URL de busqueda
    const url = API_BASE_URL + '/buscar?nombre=' + encodeURIComponent(nombre);
    console.log('URL de busqueda:', url);
    
    // Hacer peticion con timeout mas corto
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos
    
    fetch(url, {
        signal: controller.signal
    })
    .then(response => {
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Resultado de busqueda:', data);
        
        if (data.success) {
            // Exito: mostrar materia encontrada
            mostrarMateriaEncontrada(data.materia);
            mostrarMensaje('mensaje-eliminar', data.message, 'success');
        } else {
            // Error: materia no encontrada
            mostrarMensaje('mensaje-eliminar', data.message, 'warning');
        }
    })
    .catch(error => {
        clearTimeout(timeoutId);
        console.error('Error en busqueda:', error);
        
        if (error.name === 'AbortError') {
            mostrarMensaje('mensaje-eliminar', 'Tiempo de espera agotado. El servidor no respondio.', 'error');
        } else if (error.message.includes('Failed to fetch')) {
            mostrarMensaje('mensaje-eliminar', 'Error de conexion. Verifica tu conexion a internet.', 'error');
        } else {
            mostrarMensaje('mensaje-eliminar', 'Error: ' + error.message, 'error');
        }
    })
    .finally(() => {
        // Restaurar boton
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = textoOriginal;
    });
}

function mostrarMateriaEncontrada(materia) {
    console.log('Mostrando materia encontrada:', materia);
    
    // Actualizar informacion en la pagina
    document.getElementById('info-id').textContent = materia.id;
    document.getElementById('info-nombre').textContent = materia.nombre;
    
    // Mostrar el div de informacion
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'block';
        
        // Desplazar vista para que se vea
        setTimeout(() => {
            infoDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
}

function confirmarEliminacion() {
    const idElement = document.getElementById('info-id');
    const nombreElement = document.getElementById('info-nombre');
    
    if (!idElement || !nombreElement) {
        mostrarMensaje('mensaje-eliminar', 'Error: Informacion no disponible', 'error');
        return;
    }
    
    const id = idElement.textContent.trim();
    const nombre = nombreElement.textContent.trim();
    
    // Validar que haya informacion
    if (!id || !nombre || id === '' || nombre === '') {
        mostrarMensaje('mensaje-eliminar', 'Primero debes buscar una materia', 'warning');
        return;
    }
    
    // Confirmacion
    if (!confirm('¿ESTAS SEGURO DE ELIMINAR ESTA MATERIA?\n\nMateria: ' + nombre + '\nID: ' + id + '\n\nESTA ACCION NO SE PUEDE DESHACER.')) {
        console.log('Eliminacion cancelada por el usuario');
        return;
    }
    
    // Obtener boton de confirmacion
    const btnConfirmar = document.querySelector('#form-confirmar-eliminar button[type="submit"]');
    const textoOriginal = btnConfirmar.innerHTML;
    
    // Cambiar estado del boton
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = 'Eliminando...';
    
    console.log('Enviando solicitud de eliminacion para ID:', id);
    
    // Enviar solicitud de eliminacion
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log('Respuesta de eliminacion:', data);
        
        if (data.success) {
            // Exito
            mostrarMensaje('mensaje-eliminar', data.message, 'success');
            
            // Limpiar todo el formulario
            limpiarFormularioEliminar();
            
            // Mostrar alerta final
            setTimeout(() => {
                alert('Materia eliminada exitosamente:\n\n' + nombre);
            }, 300);
        } else {
            // Error del servidor
            mostrarMensaje('mensaje-eliminar', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error en eliminacion:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexion al eliminar', 'error');
    })
    .finally(() => {
        // Restaurar boton
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = textoOriginal;
    });
}

function limpiarFormularioEliminar() {
    console.log('Limpiando formulario de eliminacion');
    
    // Limpiar campo de busqueda
    const inputBuscar = document.getElementById('buscar-nombre');
    if (inputBuscar) {
        inputBuscar.value = '';
    }
    
    // Ocultar informacion de materia
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    // Limpiar datos mostrados
    document.getElementById('info-id').textContent = '';
    document.getElementById('info-nombre').textContent = '';
    
    // Limpiar mensajes
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    if (mensajeDiv) {
        mensajeDiv.innerHTML = '';
    }
    
    // Enfocar campo de busqueda para nueva busqueda
    if (inputBuscar) {
        inputBuscar.focus();
    }
}

// ===== FUNCIONES AUXILIARES =====
function mostrarMensaje(elementId, texto, tipo) {
    const mensajeDiv = document.getElementById(elementId);
    if (!mensajeDiv) {
        console.warn('Elemento no encontrado:', elementId);
        alert(texto); // Fallback
        return;
    }
    
    let color = '#333';
    
    switch(tipo) {
        case 'success':
            color = '#28a745';
            break;
        case 'error':
            color = '#dc3545';
            break;
        case 'warning':
            color = '#ffc107';
            break;
        default:
            color = '#17a2b8';
    }
    
    mensajeDiv.innerHTML = `
        <div style="padding: 10px; margin: 10px 0; border-left: 4px solid ${color}; background: ${color}15; color: ${color};">
            ${texto}
        </div>
    `;
    mensajeDiv.style.display = 'block';
    
    // Auto-ocultar despues de 5 segundos (excepto success)
    if (tipo !== 'success') {
        setTimeout(() => {
            if (mensajeDiv.innerHTML.includes(texto)) {
                mensajeDiv.innerHTML = '';
                mensajeDiv.style.display = 'none';
            }
        }, 5000);
    }
}

// ===== EXPORTAR FUNCIONES PARA HTML =====
window.registrarMateria = registrarMateria;
window.buscarMateriaParaEliminar = buscarMateriaParaEliminar;
window.confirmarEliminacion = confirmarEliminacion;