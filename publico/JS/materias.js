// publico/JS/materias.js

const API_BASE = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de materias cargado');
    
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

// ===== REGISTRAR MATERIA =====
function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    
    if (!inputNombre || !btnGuardar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre de la materia es obligatorio');
        inputNombre.focus();
        return;
    }
    
    const textoOriginal = btnGuardar.innerHTML;
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { nombre: nombre };
    
    console.log('Registrando:', datos);
    
    // Usar Promise.race para timeout
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: El servidor no respondió')), 10000);
    });
    
    const fetchPromise = fetch(API_BASE + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    
    Promise.race([fetchPromise, timeoutPromise])
    .then(response => {
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta:', data);
        
        if (data.success) {
            alert('EXITO: ' + data.message);
            inputNombre.value = '';
        } else {
            alert('ERROR: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    })
    .finally(() => {
        // ESTO ES CRÍTICO: SIEMPRE se ejecuta
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        console.log('Botón restaurado');
    });
}

// ===== ELIMINAR MATERIA =====
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
        if (mensajeDiv) {
            mostrarMensaje(mensajeDiv, 'Por favor, escriba el nombre de la materia', 'warning');
        } else {
            alert('Por favor, escriba el nombre de la materia');
        }
        inputNombre.focus();
        return;
    }
    
    // CONFIRMACION FINAL
    if (!confirm('¿ESTA SEGURO DE ELIMINAR ESTA MATERIA?\n\nMateria: ' + nombre + '\n\nESTA ACCION NO SE PUEDE DESHACER.')) {
        return;
    }
    
    const textoOriginal = btnEliminar.innerHTML;
    btnEliminar.disabled = true;
    btnEliminar.innerHTML = 'Eliminando...';
    
    // Limpiar mensaje anterior
    if (mensajeDiv) {
        mensajeDiv.innerHTML = '';
        mensajeDiv.className = 'mensaje';
        mensajeDiv.style.display = 'none';
    }
    
    const datos = { nombre: nombre };
    
    console.log('Eliminando:', datos);
    
    // Usar Promise.race para timeout
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: El servidor no respondió')), 10000);
    });
    
    const fetchPromise = fetch(API_BASE + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    
    Promise.race([fetchPromise, timeoutPromise])
    .then(response => {
        console.log('Status:', response.status);
        
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        
        return response.json();
    })
    .then(data => {
        console.log('Respuesta:', data);
        
        if (mensajeDiv) {
            if (data.success) {
                mostrarMensaje(mensajeDiv, data.message, 'success');
                inputNombre.value = ''; // Limpiar campo
            } else {
                mostrarMensaje(mensajeDiv, data.message, 'error');
            }
        } else {
            // Fallback si no hay mensajeDiv
            if (data.success) {
                alert('EXITO: ' + data.message);
                inputNombre.value = '';
            } else {
                alert('ERROR: ' + data.message);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
        if (mensajeDiv) {
            mostrarMensaje(mensajeDiv, 'Error: ' + error.message, 'error');
        } else {
            alert('Error: ' + error.message);
        }
    })
    .finally(() => {
        // ESTO ES CRÍTICO: SIEMPRE se ejecuta
        btnEliminar.disabled = false;
        btnEliminar.innerHTML = textoOriginal;
        console.log('Botón de eliminar restaurado');
    });
}

// ===== FUNCION AUXILIAR =====
function mostrarMensaje(elemento, texto, tipo) {
    if (!elemento) {
        alert(texto);
        return;
    }
    
    elemento.innerHTML = texto;
    elemento.className = 'mensaje mensaje-' + tipo;
    elemento.style.display = 'block';
    
    // Auto-ocultar mensajes después de 5 segundos
    setTimeout(() => {
        if (elemento.innerHTML === texto) {
            elemento.style.display = 'none';
            elemento.innerHTML = '';
        }
    }, 5000);
}

// Exportar funciones si se necesitan
window.registrarMateria = registrarMateria;
window.eliminarMateria = eliminarMateria;