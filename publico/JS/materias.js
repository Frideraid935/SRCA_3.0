// publico/JS/materias.js

const API_BASE = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('JS de materias cargado');
    
    // Configurar REGISTRAR
    const formRegistrar = document.getElementById('formulario-ingresar');
    if (formRegistrar) {
        console.log('Formulario de registro encontrado');
        formRegistrar.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // Configurar ELIMINAR
    const formEliminar = document.getElementById('form-eliminar-materia');
    if (formEliminar) {
        console.log('Formulario de eliminar encontrado');
        formEliminar.addEventListener('submit', function(e) {
            e.preventDefault();
            eliminarMateria();
        });
    }
});

// ===== FUNCIÓN PARA REGISTRAR MATERIA =====
function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    
    if (!inputNombre || !btnGuardar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre es obligatorio');
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnGuardar.innerHTML;
    
    // Cambiar estado
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { nombre: nombre };
    
    // Enviar petición
    fetch(API_BASE + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Éxito: ' + data.message);
            inputNombre.value = '';
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión');
    })
    .finally(() => {
        // Siempre restaurar el botón
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
    });
}

// ===== FUNCIÓN PARA ELIMINAR MATERIA =====
function eliminarMateria() {
    const inputNombre = document.getElementById('nombre-materia');
    const btnEliminar = document.getElementById('btn-eliminar');
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    
    if (!inputNombre || !btnEliminar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        mostrarMensaje('mensaje-eliminar', 'Escribe el nombre de la materia', 'error');
        inputNombre.focus();
        return;
    }
    
    // Confirmación FINAL
    if (!confirm(`¿ESTÁS ABSOLUTAMENTE SEGURO DE ELIMINAR LA MATERIA?\n\n"${nombre}"\n\nESTA ACCIÓN NO SE PUEDE DESHACER.`)) {
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnEliminar.innerHTML;
    
    // Cambiar estado
    btnEliminar.disabled = true;
    btnEliminar.innerHTML = 'Eliminando...';
    
    // Limpiar mensajes anteriores
    if (mensajeDiv) {
        mensajeDiv.innerHTML = '';
        mensajeDiv.className = 'mensaje';
        mensajeDiv.style.display = 'none';
    }
    
    const datos = { nombre: nombre };
    
    console.log('Eliminando materia:', nombre);
    
    // Enviar petición de eliminación
    fetch(API_BASE + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Respuesta:', data);
        
        if (mensajeDiv) {
            if (data.success) {
                mostrarMensaje('mensaje-eliminar', '✅ ' + data.message, 'success');
                inputNombre.value = ''; // Limpiar campo
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    mensajeDiv.style.display = 'none';
                }, 5000);
            } else {
                mostrarMensaje('mensaje-eliminar', '❌ ' + data.message, 'error');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (mensajeDiv) {
            mostrarMensaje('mensaje-eliminar', '❌ Error de conexión con el servidor', 'error');
        }
    })
    .finally(() => {
        // Siempre restaurar el botón
        btnEliminar.disabled = false;
        btnEliminar.innerHTML = textoOriginal;
    });
}

// ===== FUNCIÓN AUXILIAR =====
function mostrarMensaje(elementId, texto, tipo) {
    const mensajeDiv = document.getElementById(elementId);
    if (!mensajeDiv) {
        alert(texto); // Fallback
        return;
    }
    
    mensajeDiv.innerHTML = texto;
    mensajeDiv.className = 'mensaje mensaje-' + tipo;
    mensajeDiv.style.display = 'block';
}