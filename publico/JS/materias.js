// publico/JS/materias.js

const API_BASE = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de materias cargado');
    
    // Configurar REGISTRAR materia
    const formRegistrar = document.getElementById('formulario-ingresar');
    if (formRegistrar) {
        console.log('Formulario de registro encontrado');
        formRegistrar.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // Configurar ELIMINAR materia
    const formBuscar = document.getElementById('form-buscar-materia');
    const formConfirmar = document.getElementById('form-confirmar-eliminar');
    
    if (formBuscar) {
        console.log('Formulario de busqueda encontrado');
        formBuscar.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarMateria();
        });
    }
    
    if (formConfirmar) {
        console.log('Formulario de confirmacion encontrado');
        formConfirmar.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmarEliminacion();
        });
    }
});

// ===== REGISTRAR MATERIA =====
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
    
    const textoOriginal = btnGuardar.innerHTML;
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { nombre: nombre };
    
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
            alert(data.message);
            inputNombre.value = '';
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexion con el servidor');
    })
    .finally(() => {
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
    });
}

// ===== BUSCAR MATERIA PARA ELIMINAR =====
function buscarMateria() {
    const inputBuscar = document.getElementById('buscar-nombre');
    const btnBuscar = document.querySelector('#form-buscar-materia button[type="submit"]');
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    
    if (!inputBuscar || !btnBuscar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const nombre = inputBuscar.value.trim();
    if (!nombre) {
        mostrarMensaje(mensajeDiv, 'Escribe el nombre de la materia', 'error');
        inputBuscar.focus();
        return;
    }
    
    const textoOriginal = btnBuscar.innerHTML;
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = 'Buscando...';
    
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    if (mensajeDiv) {
        mensajeDiv.innerHTML = '';
        mensajeDiv.className = 'mensaje';
        mensajeDiv.style.display = 'none';
    }
    
    fetch(API_BASE + '/buscar?nombre=' + encodeURIComponent(nombre))
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarMateriaEncontrada(data.materia);
            mostrarMensaje(mensajeDiv, 'Materia encontrada', 'success');
        } else {
            mostrarMensaje(mensajeDiv, data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error en busqueda:', error);
        mostrarMensaje(mensajeDiv, 'Error de conexion', 'error');
    })
    .finally(() => {
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = textoOriginal;
    });
}

// ===== MOSTRAR MATERIA ENCONTRADA =====
function mostrarMateriaEncontrada(materia) {
    document.getElementById('info-id').textContent = materia.id;
    document.getElementById('info-nombre').textContent = materia.nombre;
    
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'block';
        infoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== CONFIRMAR ELIMINACION =====
function confirmarEliminacion() {
    const idElement = document.getElementById('info-id');
    const nombreElement = document.getElementById('info-nombre');
    const btnConfirmar = document.querySelector('#form-confirmar-eliminar button[type="submit"]');
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    
    if (!idElement || !nombreElement || !btnConfirmar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const id = idElement.textContent.trim();
    const nombre = nombreElement.textContent.trim();
    
    if (!id || !nombre) {
        mostrarMensaje(mensajeDiv, 'Primero debes buscar una materia', 'error');
        return;
    }
    
    if (!confirm('¿ESTA SEGURO DE ELIMINAR ESTA MATERIA?\n\nMateria: ' + nombre + '\nID: ' + id + '\n\nEsta accion no se puede deshacer.')) {
        return;
    }
    
    const textoOriginal = btnConfirmar.innerHTML;
    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = 'Eliminando...';
    
    fetch(API_BASE + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje(mensajeDiv, data.message, 'success');
            
            const infoDiv = document.getElementById('info-materia');
            if (infoDiv) {
                infoDiv.style.display = 'none';
            }
            
            document.getElementById('buscar-nombre').value = '';
            document.getElementById('info-id').textContent = '';
            document.getElementById('info-nombre').textContent = '';
            
            setTimeout(() => {
                if (mensajeDiv && mensajeDiv.style.display === 'block') {
                    mensajeDiv.style.display = 'none';
                }
            }, 5000);
        } else {
            mostrarMensaje(mensajeDiv, data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error en eliminacion:', error);
        mostrarMensaje(mensajeDiv, 'Error de conexion', 'error');
    })
    .finally(() => {
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = textoOriginal;
    });
}

// ===== FUNCION AUXILIAR PARA MOSTRAR MENSAJES =====
function mostrarMensaje(elemento, texto, tipo) {
    if (!elemento) {
        alert(texto);
        return;
    }
    
    elemento.innerHTML = texto;
    elemento.className = 'mensaje mensaje-' + tipo;
    elemento.style.display = 'block';
    
    if (tipo !== 'success') {
        setTimeout(() => {
            if (elemento.innerHTML === texto) {
                elemento.style.display = 'none';
                elemento.innerHTML = '';
            }
        }, 5000);
    }
}

// Exportar funciones si se necesitan
window.registrarMateria = registrarMateria;
window.buscarMateria = buscarMateria;
window.confirmarEliminacion = confirmarEliminacion;