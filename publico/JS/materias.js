// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

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
    }
    
    // ===== PÁGINA DE ELIMINACIÓN =====
    if (window.location.pathname.includes('eliminar')) {
        console.log('Página de eliminación detectada');
        inicializarBusquedaEliminar();
    }
    
    // ===== TABLA DE MATERIAS =====
    if (document.querySelector('table')) {
        cargarMateriasEnTabla();
    }
});

// ========== REGISTRAR MATERIA ==========
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
    
    // Guardar texto original
    const textoOriginal = btnGuardar.innerHTML;
    
    // Desactivar botón
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { nombre: nombre };
    
    console.log('Enviando datos:', datos);
    
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('Status respuesta:', response.status);
        
        // RESTAURAR BOTÓN INMEDIATAMENTE
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta:', data);
        
        if (data.success) {
            alert('Materia registrada: ' + data.message);
            
            // Limpiar formulario
            inputNombre.value = '';
            const inputId = document.getElementById('materia-id');
            if (inputId) inputId.value = '';
            
            // Si estamos en página de eliminación, recargar
            if (window.location.pathname.includes('eliminar')) {
                // Limpiar resultados de búsqueda
                document.getElementById('resultados-busqueda').style.display = 'none';
                document.getElementById('info-materia').style.display = 'none';
                document.getElementById('input-nombre-materia').value = '';
            }
            
            // Si hay tabla, recargar
            if (document.querySelector('table')) {
                cargarMateriasEnTabla();
            }
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error completo:', error);
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        alert('Error de conexión con el servidor');
    });
}

// ========== NUEVO SISTEMA DE ELIMINACIÓN ==========
function inicializarBusquedaEliminar() {
    console.log('Inicializando búsqueda para eliminar...');
    
    // Verificar si ya existe el formulario de búsqueda
    let formBusqueda = document.getElementById('form-buscar-materia');
    if (!formBusqueda) {
        // Crear contenedor si no existe
        const container = document.querySelector('.container, .contenedor, main') || document.body;
        formBusqueda = document.createElement('div');
        formBusqueda.id = 'form-buscar-materia';
        formBusqueda.className = 'busqueda-container';
        container.prepend(formBusqueda);
    }
    
    // Limpiar y crear formulario de búsqueda
    formBusqueda.innerHTML = `
        <h3 class="text-center mb-4">Buscar Materia para Eliminar</h3>
        <div class="card">
            <div class="card-body">
                <div class="form-group">
                    <label for="input-nombre-materia">Nombre de la Materia:</label>
                    <div class="input-group">
                        <input type="text" 
                               id="input-nombre-materia" 
                               class="form-control" 
                               placeholder="Ingrese el nombre completo o parcial de la materia"
                               autocomplete="off">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button" id="btn-buscar-materia">
                                <i class="fas fa-search"></i> Buscar
                            </button>
                        </div>
                    </div>
                    <small class="form-text text-muted">
                        Escriba al menos 2 caracteres para buscar
                    </small>
                </div>
                
                <!-- Resultados de búsqueda -->
                <div id="resultados-busqueda" class="mt-3" style="display: none;">
                    <h5>Resultados de la búsqueda:</h5>
                    <div id="lista-resultados" class="list-group"></div>
                </div>
                
                <!-- Información de la materia seleccionada -->
                <div id="info-materia" class="mt-4" style="display: none;">
                    <h5>Materia Seleccionada:</h5>
                    <div class="card">
                        <div class="card-body">
                            <p><strong>ID:</strong> <span id="info-id"></span></p>
                            <p><strong>Nombre:</strong> <span id="info-nombre"></span></p>
                            <div class="text-center mt-3">
                                <button class="btn btn-danger btn-lg" onclick="confirmarEliminacion()">
                                    <i class="fas fa-trash"></i> ELIMINAR MATERIA
                                </button>
                                <button class="btn btn-secondary btn-lg ml-2" onclick="cancelarSeleccion()">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Mensajes de estado -->
                <div id="mensaje-busqueda" class="mt-3 alert" style="display: none;"></div>
            </div>
        </div>
    `;
    
    // Agregar evento al botón de búsqueda
    document.getElementById('btn-buscar-materia').addEventListener('click', buscarMateriaPorNombre);
    
    // También buscar al presionar Enter
    document.getElementById('input-nombre-materia').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarMateriaPorNombre();
        }
    });
}

function buscarMateriaPorNombre() {
    const input = document.getElementById('input-nombre-materia');
    const query = input.value.trim();
    
    if (query.length < 2) {
        mostrarMensaje('Escriba al menos 2 caracteres para buscar', 'warning');
        return;
    }
    
    // Mostrar mensaje de carga
    mostrarMensaje('Buscando materias...', 'info');
    
    // Ocultar resultados anteriores
    document.getElementById('resultados-busqueda').style.display = 'none';
    document.getElementById('info-materia').style.display = 'none';
    
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
            mostrarResultadosBusqueda(data.materias, query);
        } else {
            mostrarMensaje(data.message || 'Error en la búsqueda', 'danger');
        }
    })
    .catch(error => {
        console.error('Error en búsqueda:', error);
        mostrarMensaje('Error de conexión con el servidor', 'danger');
    });
}

function mostrarResultadosBusqueda(materias, query) {
    const resultadosDiv = document.getElementById('resultados-busqueda');
    const listaResultados = document.getElementById('lista-resultados');
    
    // Ocultar mensajes
    document.getElementById('mensaje-busqueda').style.display = 'none';
    
    if (!materias || materias.length === 0) {
        mostrarMensaje(`No se encontraron materias con "${query}"`, 'warning');
        return;
    }
    
    // Limpiar lista
    listaResultados.innerHTML = '';
    
    // Mostrar cada materia encontrada
    materias.forEach(materia => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'list-group-item list-group-item-action';
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${materia.nombre}</strong>
                    <br>
                    <small class="text-muted">ID: ${materia.id}</small>
                </div>
                <span class="badge badge-primary">Seleccionar</span>
            </div>
        `;
        
        item.addEventListener('click', function() {
            seleccionarMateria(materia);
        });
        
        listaResultados.appendChild(item);
    });
    
    // Mostrar resultados
    resultadosDiv.style.display = 'block';
}

function seleccionarMateria(materia) {
    console.log('Materia seleccionada:', materia);
    
    // Mostrar información de la materia
    document.getElementById('info-id').textContent = materia.id;
    document.getElementById('info-nombre').textContent = materia.nombre;
    document.getElementById('info-materia').style.display = 'block';
    
    // Desplazarse a la sección de confirmación
    document.getElementById('info-materia').scrollIntoView({ behavior: 'smooth' });
}

function confirmarEliminacion() {
    const idElement = document.getElementById('info-id');
    const nombreElement = document.getElementById('info-nombre');
    
    const id = idElement ? idElement.textContent.trim() : '';
    const nombre = nombreElement ? nombreElement.textContent.trim() : '';
    
    if (!id) {
        alert('Error: No hay materia seleccionada');
        return;
    }
    
    if (!confirm(`¿ESTÁ SEGURO que desea eliminar la materia:\n\n"${nombre}" (ID: ${id})?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    eliminarMateria(id, nombre);
}

function eliminarMateria(id, nombre) {
    if (!id || isNaN(id)) {
        alert('ID no válido');
        return;
    }
    
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
            alert(`Materia "${nombre}" eliminada exitosamente`);
            
            // Limpiar todo el formulario
            cancelarSeleccion();
            
            // Limpiar campo de búsqueda
            document.getElementById('input-nombre-materia').value = '';
            
            // Recargar tabla si existe
            if (document.querySelector('table')) {
                cargarMateriasEnTabla();
            }
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    });
}

function cancelarSeleccion() {
    // Ocultar información de materia
    document.getElementById('info-materia').style.display = 'none';
    
    // Limpiar campos
    document.getElementById('info-id').textContent = '';
    document.getElementById('info-nombre').textContent = '';
    
    // Ocultar resultados
    document.getElementById('resultados-busqueda').style.display = 'none';
    
    // Limpiar mensajes
    document.getElementById('mensaje-busqueda').style.display = 'none';
}

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje-busqueda');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `alert alert-${tipo} mt-3`;
    mensajeDiv.style.display = 'block';
}

// ========== FUNCIONES PARA TABLA ==========
function cargarMateriasEnTabla() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="3">Cargando materias...</td></tr>';
    
    fetch(API_BASE_URL + '/listar')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMateriasTabla(data.materias);
        } else {
            tbody.innerHTML = '<tr><td colspan="3">Error: ' + data.message + '</td></tr>';
        }
    })
    .catch(error => {
        tbody.innerHTML = '<tr><td colspan="3">Error de conexión</td></tr>';
    });
}

function mostrarMateriasTabla(materias) {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    if (!materias || materias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">No hay materias registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    materias.forEach(materia => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${materia.id}</td>
            <td>${materia.nombre}</td>
            <td>
                <button onclick="eliminarMateriaDesdeTabla(${materia.id}, '${materia.nombre.replace(/'/g, "\\'")}')" 
                        class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarMateriaDesdeTabla(id, nombre) {
    if (!confirm(`¿Eliminar materia "${nombre}"?`)) {
        return;
    }
    
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
            alert('Materia eliminada');
            cargarMateriasEnTabla();
            
            // Si estamos en página de eliminación, limpiar búsqueda
            if (window.location.pathname.includes('eliminar')) {
                cancelarSeleccion();
                document.getElementById('input-nombre-materia').value = '';
            }
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error de conexión');
    });
}

// ========== EXPORTAR FUNCIONES ==========
window.registrarMateria = registrarMateria;
window.buscarMateriaPorNombre = buscarMateriaPorNombre;
window.seleccionarMateria = seleccionarMateria;
window.confirmarEliminacion = confirmarEliminacion;
window.cancelarSeleccion = cancelarSeleccion;
window.eliminarMateria = eliminarMateria;
window.eliminarMateriaDesdeTabla = eliminarMateriaDesdeTabla;