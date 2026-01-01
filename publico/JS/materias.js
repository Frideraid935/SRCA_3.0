// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Materias JS cargado');
    
    // ===== REGISTRAR MATERIA =====
    const formRegistro = document.getElementById('formulario-ingresar');
    if (formRegistro) {
        console.log('Formulario de registro encontrado');
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // ===== ELIMINAR MATERIA =====
    const formBusqueda = document.getElementById('form-buscar-materia');
    if (formBusqueda) {
        console.log('Formulario de búsqueda para eliminar encontrado');
        formBusqueda.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarMateriaParaEliminar();
        });
    }
    
    // ===== CONFIRMAR ELIMINACIÓN =====
    const formConfirmar = document.getElementById('form-confirmar-eliminar');
    if (formConfirmar) {
        console.log('Formulario de confirmación encontrado');
        formConfirmar.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmarEliminacion();
        });
    }
});

// ========== FUNCIÓN PARA REGISTRAR MATERIA ==========
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
        inputNombre.focus();
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnGuardar.innerHTML;
    
    // Cambiar estado
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { nombre: nombre };
    
    console.log('Registrando:', datos);
    
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
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
        
        if (data.success) {
            alert(data.message);
            inputNombre.value = ''; // Limpiar campo
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión');
    })
    .finally(() => {
        // IMPORTANTE: SIEMPRE RESTAURAR EL BOTÓN
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
    });
}

// ========== FUNCIONES PARA ELIMINAR MATERIA ==========
function buscarMateriaParaEliminar() {
    const inputBuscar = document.getElementById('buscar-nombre');
    const btnBuscar = document.querySelector('#form-buscar-materia button[type="submit"]');
    
    if (!inputBuscar || !btnBuscar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const nombre = inputBuscar.value.trim();
    
    if (!nombre) {
        mostrarMensaje('Escribe el nombre de la materia', 'warning');
        inputBuscar.focus();
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnBuscar.innerHTML;
    
    // Cambiar estado
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    
    // Ocultar información anterior
    document.getElementById('info-materia').style.display = 'none';
    
    // Limpiar mensajes
    document.getElementById('mensaje-eliminar').innerHTML = '';
    
    console.log('Buscando materia para eliminar:', nombre);
    
    // Realizar búsqueda
    fetch(`${API_BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta búsqueda:', data);
        
        if (data.success) {
            // Mostrar la materia encontrada
            mostrarMateriaEncontrada(data.materia);
            mostrarMensaje('✅ Materia encontrada', 'success');
        } else {
            mostrarMensaje(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    })
    .finally(() => {
        // Restaurar botón
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = textoOriginal;
    });
}

function mostrarMateriaEncontrada(materia) {
    console.log('Mostrando materia encontrada:', materia);
    
    // Mostrar información de la materia
    document.getElementById('info-id').textContent = materia.id;
    document.getElementById('info-nombre').textContent = materia.nombre;
    
    // Mostrar el contenedor de información
    const infoDiv = document.getElementById('info-materia');
    infoDiv.style.display = 'block';
    
    // Desplazar vista al resultado
    infoDiv.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function confirmarEliminacion() {
    const idElement = document.getElementById('info-id');
    const nombreElement = document.getElementById('info-nombre');
    
    if (!idElement || !nombreElement) {
        alert('Error: Información no disponible');
        return;
    }
    
    const id = idElement.textContent.trim();
    const nombre = nombreElement.textContent.trim();
    
    if (!id || !nombre) {
        mostrarMensaje('Primero debes buscar una materia', 'warning');
        return;
    }
    
    // Confirmación DOBLE
    if (!confirm(`¿ESTÁS ABSOLUTAMENTE SEGURO DE ELIMINAR ESTA MATERIA?\n\nMATERIA: ${nombre}\nID: ${id}\n\n⚠️ Esta acción NO se puede deshacer.`)) {
        return;
    }
    
    const btnConfirmar = document.querySelector('#form-confirmar-eliminar button[type="submit"]');
    const textoOriginal = btnConfirmar.innerHTML;
    
    // Cambiar estado del botón
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
    
    // Enviar solicitud de eliminación
    console.log('Eliminando materia ID:', id);
    
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la eliminación');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta eliminación:', data);
        
        if (data.success) {
            mostrarMensaje('✅ ' + data.message, 'success');
            
            // Limpiar todo el formulario
            limpiarFormularioEliminar();
            
            // Mostrar alerta final
            setTimeout(() => {
                alert(`Materia eliminada exitosamente:\n\n"${nombre}"`);
            }, 500);
        } else {
            mostrarMensaje('❌ ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Error de conexión al eliminar', 'error');
    })
    .finally(() => {
        // Restaurar botón
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = textoOriginal;
    });
}

function limpiarFormularioEliminar() {
    // Limpiar campo de búsqueda
    document.getElementById('buscar-nombre').value = '';
    
    // Ocultar información de materia
    document.getElementById('info-materia').style.display = 'none';
    
    // Limpiar datos mostrados
    document.getElementById('info-id').textContent = '';
    document.getElementById('info-nombre').textContent = '';
    
    // Enfocar campo de búsqueda
    document.getElementById('buscar-nombre').focus();
}

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    
    // Determinar clase CSS según tipo
    let claseCss = 'mensaje-';
    switch(tipo) {
        case 'success': claseCss += 'success'; break;
        case 'error': claseCss += 'error'; break;
        case 'warning': claseCss += 'warning'; break;
        default: claseCss += 'info';
    }
    
    mensajeDiv.innerHTML = `
        <div class="${claseCss}">
            ${texto}
        </div>
    `;
    
    mensajeDiv.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos (excepto success)
    if (tipo !== 'success') {
        setTimeout(() => {
            mensajeDiv.innerHTML = '';
            mensajeDiv.style.display = 'none';
        }, 5000);
    }
}

// ========== EXPORTAR FUNCIONES ==========
window.registrarMateria = registrarMateria;
window.buscarMateriaParaEliminar = buscarMateriaParaEliminar;
window.confirmarEliminacion = confirmarEliminacion;