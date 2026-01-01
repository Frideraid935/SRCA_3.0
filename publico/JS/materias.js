// publico/JS/materias.js

const API_BASE_URL = '/api/materias';
let botonRegistrarOriginalText = '';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Materias JS cargado');
    
    // ===== FORMULARIO DE REGISTRO =====
    const formRegistro = document.getElementById('formulario-ingresar');
    if (formRegistro) {
        console.log('Formulario de registro encontrado');
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
        
        // Guardar texto original del botón
        const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
        if (btnGuardar) {
            botonRegistrarOriginalText = btnGuardar.innerHTML;
        }
    }
    
    // ===== PÁGINA DE ELIMINACIÓN =====
    if (window.location.pathname.includes('eliminar')) {
        console.log('Página de eliminación detectada');
        inicializarBusquedaEliminar();
    }
});

// ========== REGISTRAR MATERIA - CORREGIDO ==========
function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    if (!inputNombre) {
        alert('Error: Campo nombre no encontrado');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre es obligatorio');
        return;
    }
    
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    if (!btnGuardar) {
        alert('Error: Botón no encontrado');
        return;
    }
    
    // Desactivar botón
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { 
        nombre: nombre,
        btnGuardar: 'registrar' // Para debugging
    };
    
    console.log('📤 Enviando datos:', datos);
    
    // TIEMPO MÁXIMO DE ESPERA: 10 segundos
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000);
    });
    
    Promise.race([
        fetch(API_BASE_URL + '/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        }),
        timeoutPromise
    ])
    .then(response => {
        console.log('📥 Status respuesta:', response.status);
        
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Respuesta:', data);
        
        if (data.success) {
            alert('✅ Materia registrada: ' + data.message);
            
            // Limpiar formulario
            inputNombre.value = '';
            
            // Si estamos en página de eliminación, recargar búsqueda
            if (window.location.pathname.includes('eliminar')) {
                limpiarBusqueda();
            }
        } else {
            alert('❌ Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('❌ Error completo:', error);
        alert('⚠️ La materia se registró pero hubo un error en la respuesta. Verifica en la lista.');
    })
    .finally(() => {
        // ESTA LÍNEA ES CRÍTICA: SIEMPRE RESTAURA EL BOTÓN
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = botonRegistrarOriginalText || 'Guardar';
        }
    });
}

// ========== SISTEMA DE BÚSQUEDA Y ELIMINACIÓN ==========
function inicializarBusquedaEliminar() {
    console.log('Inicializando búsqueda para eliminar...');
    
    // Buscar contenedor existente
    let container = document.querySelector('.container, .contenedor, main, .content') || document.body;
    
    // Crear o limpiar contenedor de búsqueda
    let busquedaDiv = document.getElementById('busqueda-eliminar-container');
    if (!busquedaDiv) {
        busquedaDiv = document.createElement('div');
        busquedaDiv.id = 'busqueda-eliminar-container';
        busquedaDiv.className = 'busqueda-container';
        container.prepend(busquedaDiv);
    }
    
    // HTML simple y funcional
    busquedaDiv.innerHTML = `
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">
                    <i class="fas fa-search mr-2"></i>Buscar Materia para Eliminar
                </h4>
            </div>
            <div class="card-body">
                <!-- Campo de búsqueda -->
                <div class="form-group">
                    <label for="buscar-materia-input" class="font-weight-bold">
                        <i class="fas fa-book mr-1"></i>Nombre de la materia:
                    </label>
                    <div class="input-group">
                        <input type="text" 
                               id="buscar-materia-input" 
                               class="form-control form-control-lg"
                               placeholder="Ej: Matemáticas, Física, Historia..."
                               autocomplete="off"
                               autofocus>
                        <div class="input-group-append">
                            <button class="btn btn-primary btn-lg" type="button" id="btn-buscar">
                                <i class="fas fa-search mr-1"></i>Buscar
                            </button>
                        </div>
                    </div>
                    <small class="form-text text-muted mt-1">
                        Escribe al menos 2 letras del nombre de la materia
                    </small>
                </div>
                
                <!-- Resultados de búsqueda -->
                <div id="resultados-container" class="mt-4" style="display: none;">
                    <h5 class="border-bottom pb-2">
                        <i class="fas fa-list mr-2"></i>Resultados encontrados:
                    </h5>
                    <div id="lista-resultados" class="list-group"></div>
                </div>
                
                <!-- Materia seleccionada -->
                <div id="materia-seleccionada-container" class="mt-4" style="display: none;">
                    <h5 class="text-success border-bottom pb-2">
                        <i class="fas fa-check-circle mr-2"></i>Materia seleccionada:
                    </h5>
                    <div class="card border-success">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p class="mb-1"><strong>ID:</strong></p>
                                    <h4 id="selected-id" class="text-primary">-</h4>
                                </div>
                                <div class="col-md-6">
                                    <p class="mb-1"><strong>Nombre:</strong></p>
                                    <h4 id="selected-nombre" class="text-success">-</h4>
                                </div>
                            </div>
                            
                            <div class="text-center mt-4 pt-3 border-top">
                                <button class="btn btn-danger btn-lg px-5 py-3" id="btn-eliminar-materia">
                                    <i class="fas fa-trash-alt mr-2"></i>ELIMINAR MATERIA
                                </button>
                                <button class="btn btn-secondary btn-lg px-5 py-3 ml-3" id="btn-cancelar">
                                    <i class="fas fa-times mr-2"></i>Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Mensajes -->
                <div id="mensaje-container" class="mt-3"></div>
            </div>
        </div>
    `;
    
    // Eventos
    const inputBuscar = document.getElementById('buscar-materia-input');
    const btnBuscar = document.getElementById('btn-buscar');
    const btnEliminar = document.getElementById('btn-eliminar-materia');
    const btnCancelar = document.getElementById('btn-cancelar');
    
    btnBuscar.addEventListener('click', buscarMaterias);
    
    inputBuscar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarMaterias();
        }
    });
    
    inputBuscar.addEventListener('input', function(e) {
        if (e.target.value.trim().length >= 2) {
            buscarMaterias();
        } else {
            ocultarResultados();
        }
    });
    
    btnEliminar.addEventListener('click', confirmarEliminacion);
    btnCancelar.addEventListener('click', cancelarSeleccion);
}

function buscarMaterias() {
    const input = document.getElementById('buscar-materia-input');
    const query = input.value.trim();
    
    if (query.length < 2) {
        mostrarMensaje('Por favor, escribe al menos 2 caracteres para buscar.', 'warning');
        return;
    }
    
    mostrarMensaje(`<i class="fas fa-spinner fa-spin mr-2"></i>Buscando "${query}"...`, 'info');
    ocultarResultados();
    
    // Realizar búsqueda
    fetch(`${API_BASE_URL}/buscar?nombre=${encodeURIComponent(query)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            if (data.materias && data.materias.length > 0) {
                mostrarResultados(data.materias);
                mostrarMensaje(`Se encontraron ${data.materias.length} materias.`, 'success');
            } else {
                mostrarMensaje(`No se encontraron materias con "${query}".`, 'warning');
            }
        } else {
            mostrarMensaje(data.message || 'Error en la búsqueda', 'danger');
        }
    })
    .catch(error => {
        console.error('Error en búsqueda:', error);
        mostrarMensaje('Error de conexión con el servidor', 'danger');
    });
}

function mostrarResultados(materias) {
    const container = document.getElementById('resultados-container');
    const lista = document.getElementById('lista-resultados');
    
    lista.innerHTML = '';
    
    materias.forEach(materia => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'list-group-item list-group-item-action';
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-left">
                    <h6 class="mb-1 font-weight-bold">${materia.nombre}</h6>
                    <small class="text-muted">ID: ${materia.id}</small>
                </div>
                <div>
                    <span class="badge badge-success badge-pill p-2">
                        <i class="fas fa-check mr-1"></i>Seleccionar
                    </span>
                </div>
            </div>
        `;
        
        item.addEventListener('click', function() {
            seleccionarMateria(materia);
        });
        
        lista.appendChild(item);
    });
    
    container.style.display = 'block';
}

function seleccionarMateria(materia) {
    console.log('Materia seleccionada:', materia);
    
    // Actualizar información
    document.getElementById('selected-id').textContent = materia.id;
    document.getElementById('selected-nombre').textContent = materia.nombre;
    
    // Mostrar contenedor de materia seleccionada
    document.getElementById('materia-seleccionada-container').style.display = 'block';
    
    // Ocultar resultados
    document.getElementById('resultados-container').style.display = 'none';
    
    // Limpiar mensajes
    document.getElementById('mensaje-container').innerHTML = '';
    
    // Desplazar vista
    document.getElementById('materia-seleccionada-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function confirmarEliminacion() {
    const id = document.getElementById('selected-id').textContent;
    const nombre = document.getElementById('selected-nombre').textContent;
    
    if (!id || id === '-') {
        mostrarMensaje('No hay materia seleccionada.', 'warning');
        return;
    }
    
    if (!confirm(`¿ESTÁS ABSOLUTAMENTE SEGURO de eliminar la materia?\n\n"${nombre}"\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    // Desactivar botón durante eliminación
    const btnEliminar = document.getElementById('btn-eliminar-materia');
    const originalText = btnEliminar.innerHTML;
    btnEliminar.disabled = true;
    btnEliminar.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Eliminando...';
    
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje(`✅ Materia "${nombre}" eliminada exitosamente.`, 'success');
            cancelarSeleccion();
            document.getElementById('buscar-materia-input').value = '';
        } else {
            mostrarMensaje(`❌ Error: ${data.message}`, 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Error de conexión', 'danger');
    })
    .finally(() => {
        btnEliminar.disabled = false;
        btnEliminar.innerHTML = originalText;
    });
}

function cancelarSeleccion() {
    // Ocultar contenedores
    document.getElementById('materia-seleccionada-container').style.display = 'none';
    document.getElementById('resultados-container').style.display = 'none';
    
    // Limpiar campos
    document.getElementById('selected-id').textContent = '-';
    document.getElementById('selected-nombre').textContent = '-';
    
    // Limpiar mensajes
    document.getElementById('mensaje-container').innerHTML = '';
    
    // Enfocar campo de búsqueda
    document.getElementById('buscar-materia-input').focus();
}

function ocultarResultados() {
    document.getElementById('resultados-container').style.display = 'none';
}

function mostrarMensaje(texto, tipo) {
    const container = document.getElementById('mensaje-container');
    container.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `;
}

function limpiarBusqueda() {
    const input = document.getElementById('buscar-materia-input');
    if (input) {
        input.value = '';
    }
    ocultarResultados();
    cancelarSeleccion();
}

// ========== EXPORTAR FUNCIONES ==========
window.registrarMateria = registrarMateria;