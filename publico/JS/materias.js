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
        cargarMateriasParaEliminar();
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
                cargarMateriasParaEliminar();
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

// ========== FUNCIONES PARA ELIMINAR ==========
function cargarMateriasParaEliminar() {
    console.log('Cargando materias para eliminar...');
    
    fetch(API_BASE_URL + '/listar')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Materias cargadas:', data);
        
        if (data.success) {
            crearSelectorMaterias(data.materias);
        } else {
            alert('Error al cargar materias: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('No se pudo cargar la lista de materias');
    });
}

function crearSelectorMaterias(materias) {
    const formBusqueda = document.getElementById('form-buscar-materia');
    if (!formBusqueda) return;
    
    // Limpiar formulario
    formBusqueda.innerHTML = '';
    
    if (!materias || materias.length === 0) {
        formBusqueda.innerHTML = '<p class="text-center">No hay materias registradas</p>';
        return;
    }
    
    // Crear selector
    const divCampo = document.createElement('div');
    divCampo.className = 'campo';
    
    const label = document.createElement('label');
    label.textContent = 'Seleccionar Materia:';
    label.htmlFor = 'selector-materia';
    
    const select = document.createElement('select');
    select.id = 'selector-materia';
    select.className = 'form-control';
    
    // Opción por defecto
    const opcionDefault = document.createElement('option');
    opcionDefault.value = '';
    opcionDefault.textContent = '-- Seleccione una materia --';
    select.appendChild(opcionDefault);
    
    // Agregar materias
    materias.forEach(materia => {
        const opcion = document.createElement('option');
        opcion.value = materia.id;
        opcion.textContent = materia.nombre + ' (ID: ' + materia.id + ')';
        select.appendChild(opcion);
    });
    
    divCampo.appendChild(label);
    divCampo.appendChild(select);
    formBusqueda.appendChild(divCampo);
    
    // Botón para mostrar información
    const divBotones = document.createElement('div');
    divBotones.className = 'botones';
    
    const btnMostrar = document.createElement('button');
    btnMostrar.type = 'button';
    btnMostrar.className = 'btn btn-primary';
    btnMostrar.innerHTML = '<i class="fas fa-search"></i> Mostrar Información';
    btnMostrar.onclick = mostrarInfoMateriaSeleccionada;
    
    divBotones.appendChild(btnMostrar);
    formBusqueda.appendChild(divBotones);
}

function mostrarInfoMateriaSeleccionada() {
    const select = document.getElementById('selector-materia');
    if (!select) return;
    
    const materiaId = select.value;
    if (!materiaId) {
        alert('Seleccione una materia');
        return;
    }
    
    // Buscar la materia en la lista ya cargada
    fetch(API_BASE_URL + '/listar')
    .then(response => response.json())
    .then(data => {
        if (data.success && data.materias) {
            const materia = data.materias.find(m => m.id == materiaId);
            if (materia) {
                document.getElementById('info-id').textContent = materia.id;
                document.getElementById('info-nombre').textContent = materia.nombre;
                document.getElementById('info-materia').style.display = 'block';
            } else {
                alert('Materia no encontrada');
            }
        }
    })
    .catch(error => {
        alert('Error al buscar materia');
    });
}

function confirmarEliminacion() {
    const idElement = document.getElementById('info-id');
    const id = idElement ? idElement.textContent.trim() : '';
    
    if (!id) {
        alert('Primero seleccione una materia');
        return;
    }
    
    if (!confirm('¿ESTÁ SEGURO de eliminar esta materia?')) {
        return;
    }
    
    eliminarMateria(id);
}

function eliminarMateria(id) {
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
            alert('Materia eliminada: ' + data.message);
            
            // Ocultar panel
            document.getElementById('info-materia').style.display = 'none';
            
            // Recargar selector
            cargarMateriasParaEliminar();
            
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
        alert('Error de conexión');
    });
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
        tbody.innerHTML = '<tr><td colspan="3">No hay materias</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    materias.forEach(materia => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${materia.id}</td>
            <td>${materia.nombre}</td>
            <td>
                <button onclick="eliminarMateria(${materia.id})" class="btn btn-danger btn-sm">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== EXPORTAR FUNCIONES ==========
window.registrarMateria = registrarMateria;
window.eliminarMateria = eliminarMateria;
window.cargarMateriasParaEliminar = cargarMateriasParaEliminar;
window.mostrarInfoMateriaSeleccionada = mostrarInfoMateriaSeleccionada;
window.confirmarEliminacion = confirmarEliminacion;