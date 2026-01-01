// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Materias JS cargado');
    
    // Configurar formulario de registro
    const formRegistro = document.getElementById('formulario-ingresar');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // Configurar formulario de búsqueda
    const formBusqueda = document.getElementById('form-buscar-materia');
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarMateria();
        });
    }
    
    // Configurar formulario de eliminación
    const formEliminar = document.getElementById('form-confirmar-eliminar');
    if (formEliminar) {
        formEliminar.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmarEliminacion();
        });
    }
    
    // Cargar tabla si existe
    if (document.querySelector('table')) {
        cargarMaterias();
    }
});

// ========== FUNCIONES PARA REGISTRAR ==========

function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    if (!inputNombre) {
        alert('Error: No se encontró el campo nombre');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre de la materia es obligatorio');
        return;
    }
    
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    if (!btnGuardar) {
        alert('Error: No se encontró el botón guardar');
        return;
    }
    
    // Guardar texto original y desactivar botón
    const textoOriginal = btnGuardar.innerHTML;
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { nombre: nombre };
    
    // Hacer la petición
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // RESTAURAR BOTÓN INMEDIATAMENTE
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        
        if (data.success) {
            alert('Éxito: ' + data.message);
            inputNombre.value = '';
            
            // Limpiar campo ID si existe
            const inputId = document.getElementById('materia-id');
            if (inputId) inputId.value = '';
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(function(error) {
        // RESTAURAR BOTÓN SI HAY ERROR
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
        alert('Error de conexión con el servidor');
        console.error('Error:', error);
    });
}

// ========== FUNCIONES PARA BUSCAR Y ELIMINAR ==========

function buscarMateria() {
    const inputNombre = document.getElementById('buscar-nombre');
    if (!inputNombre) {
        alert('Error: No se encontró el campo de búsqueda');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('Ingrese un nombre para buscar');
        return;
    }
    
    console.log('Buscando materia con nombre:', nombre);
    
    // Primero intentar con el endpoint de búsqueda por nombre
    fetch(API_BASE_URL + '/buscar/nombre/' + encodeURIComponent(nombre))
    .then(function(response) {
        if (!response.ok) {
            // Si falla, usar el endpoint de listar
            console.log('Endpoint de búsqueda falló, usando listar');
            return fetch(API_BASE_URL + '/listar');
        }
        return response.json();
    })
    .then(function(response) {
        // Si response es Response, obtener JSON
        if (response instanceof Response) {
            return response.json();
        }
        return response;
    })
    .then(function(data) {
        console.log('Datos recibidos:', data);
        
        if (data.success && data.materias) {
            // Filtrar por nombre si usamos /listar
            let materiasEncontradas = data.materias;
            if (nombre) {
                materiasEncontradas = data.materias.filter(function(materia) {
                    return materia.nombre.toLowerCase().includes(nombre.toLowerCase());
                });
            }
            
            if (materiasEncontradas.length === 0) {
                alert('No se encontraron materias con el nombre: ' + nombre);
                ocultarInformacionMateria();
            } else if (materiasEncontradas.length === 1) {
                mostrarInformacionMateria(materiasEncontradas[0]);
            } else {
                mostrarListaMaterias(materiasEncontradas, nombre);
            }
        } else {
            alert('Error: ' + (data.message || 'No se pudieron cargar las materias'));
        }
    })
    .catch(function(error) {
        console.error('Error en búsqueda:', error);
        alert('Error de conexión');
    });
}

function mostrarListaMaterias(materias, nombreBusqueda) {
    let mensaje = 'Se encontraron ' + materias.length + ' materias:\n\n';
    
    materias.forEach(function(materia, index) {
        mensaje += (index + 1) + '. ID: ' + materia.id + ' - Nombre: ' + materia.nombre + '\n';
    });
    
    mensaje += '\nIngrese el número de la materia que desea eliminar:';
    
    const seleccion = prompt(mensaje);
    if (seleccion && !isNaN(seleccion)) {
        const index = parseInt(seleccion) - 1;
        if (index >= 0 && index < materias.length) {
            mostrarInformacionMateria(materias[index]);
        } else {
            alert('Selección inválida');
        }
    }
}

function mostrarInformacionMateria(materia) {
    console.log('Mostrando materia para eliminar:', materia);
    
    if (!materia || !materia.id) {
        alert('Error: Información de materia no válida');
        return;
    }
    
    document.getElementById('info-id').textContent = materia.id;
    document.getElementById('info-nombre').textContent = materia.nombre;
    document.getElementById('info-materia').style.display = 'block';
}

function ocultarInformacionMateria() {
    document.getElementById('info-materia').style.display = 'none';
}

function confirmarEliminacion() {
    const idElement = document.getElementById('info-id');
    const id = idElement ? idElement.textContent.trim() : '';
    
    if (!id || id === '') {
        alert('Primero busque y seleccione una materia para eliminar');
        return;
    }
    
    eliminarMateriaPorId(id);
}

function eliminarMateriaPorId(id) {
    if (!id || isNaN(id)) {
        alert('ID no válido');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar esta materia?\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    id = parseInt(id);
    
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            alert('Éxito: ' + data.message);
            
            // Limpiar formulario de búsqueda
            const inputBusqueda = document.getElementById('buscar-nombre');
            if (inputBusqueda) inputBusqueda.value = '';
            
            // Ocultar información
            ocultarInformacionMateria();
            
            // Recargar tabla si existe
            if (document.querySelector('table')) {
                cargarMaterias();
            }
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(function(error) {
        alert('Error de conexión');
        console.error('Error:', error);
    });
}

// ========== FUNCIÓN PARA TABLA ==========

function cargarMaterias() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="3">Cargando materias...</td></tr>';
    
    fetch(API_BASE_URL + '/listar')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success && data.materias) {
            mostrarMateriasEnTabla(data.materias);
        } else {
            tbody.innerHTML = '<tr><td colspan="3">Error: ' + (data.message || 'No se pudieron cargar') + '</td></tr>';
        }
    })
    .catch(function(error) {
        tbody.innerHTML = '<tr><td colspan="3">Error de conexión</td></tr>';
        console.error('Error:', error);
    });
}

function mostrarMateriasEnTabla(materias) {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    if (!materias || materias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">No hay materias registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    materias.forEach(function(materia) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${materia.id}</td>
            <td>${materia.nombre}</td>
            <td>
                <button onclick="eliminarMateriaPorId(${materia.id})" class="btn btn-danger btn-sm">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== EXPORTAR FUNCIONES ==========

window.registrarMateria = registrarMateria;
window.eliminarMateriaPorId = eliminarMateriaPorId;
window.cargarMaterias = cargarMaterias;
window.buscarMateria = buscarMateria;
window.confirmarEliminacion = confirmarEliminacion;