// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Materias JS cargado');
    
    const formRegistro = document.getElementById('formulario-ingresar');
    const formBusqueda = document.getElementById('form-buscar-materia');
    const formEliminar = document.getElementById('form-confirmar-eliminar');
    
    if (formRegistro) {
        console.log('Configurando formulario de registro');
        configurarFormularioRegistro(formRegistro);
    }
    
    if (formBusqueda) {
        console.log('Configurando formulario de búsqueda');
        configurarFormularioBusqueda(formBusqueda);
    }
    
    if (formEliminar) {
        console.log('Configurando formulario de eliminación');
        configurarFormularioEliminar(formEliminar);
    }
    
    const table = document.querySelector('table');
    if (table) {
        console.log('Cargando tabla de materias');
        cargarMaterias();
    }
});

function configurarFormularioRegistro(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        registrarMateria();
    });
}

function configurarFormularioBusqueda(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        buscarMateriaPorNombre();
    });
}

function configurarFormularioEliminar(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        confirmarEliminacion();
    });
}

function cargarMaterias() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';
    
    fetch(API_BASE_URL + '/listar', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMaterias(data.materias || []);
        } else {
            alert('Error: ' + (data.message || 'No se pudieron cargar'));
        }
    })
    .catch(error => {
        alert('Error de conexión');
    });
}

function mostrarMaterias(materias) {
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
                <button onclick="eliminarMateriaPorId(${materia.id})" class="btn btn-danger btn-sm">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function buscarMateriaPorNombre() {
    const inputNombre = document.getElementById('buscar-nombre');
    if (!inputNombre) return;
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('Ingrese un nombre para buscar');
        return;
    }
    
    // Mostrar que está buscando
    const infoMateria = document.getElementById('info-materia');
    if (infoMateria) {
        infoMateria.style.display = 'block';
        document.getElementById('info-id').textContent = 'Buscando...';
        document.getElementById('info-nombre').textContent = 'Buscando...';
    }
    
    fetch(API_BASE_URL + '/buscar/nombre/' + encodeURIComponent(nombre), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta búsqueda:', data);
        
        if (data.success) {
            if (data.materias && data.materias.length > 0) {
                if (data.materias.length === 1) {
                    mostrarInformacionMateria(data.materias[0]);
                } else {
                    mostrarListaMaterias(data.materias, nombre);
                }
            } else {
                alert('No se encontró ninguna materia con ese nombre');
                ocultarInformacionMateria();
            }
        } else {
            alert('Error: ' + data.message);
            ocultarInformacionMateria();
        }
    })
    .catch(error => {
        console.error('Error en búsqueda:', error);
        alert('Error de conexión');
        ocultarInformacionMateria();
    });
}

function mostrarListaMaterias(materias, nombreBusqueda) {
    let mensaje = `Se encontraron ${materias.length} materias:\n\n`;
    materias.forEach((materia, index) => {
        mensaje += `${index + 1}. ID: ${materia.id} - Nombre: ${materia.nombre}\n`;
    });
    
    const seleccion = prompt(mensaje + '\nIngrese el número de la materia que desea eliminar:');
    if (seleccion && !isNaN(seleccion)) {
        const index = parseInt(seleccion) - 1;
        if (index >= 0 && index < materias.length) {
            mostrarInformacionMateria(materias[index]);
        } else {
            alert('Selección inválida');
            ocultarInformacionMateria();
        }
    } else {
        ocultarInformacionMateria();
    }
}

function mostrarInformacionMateria(materia) {
    console.log('Mostrando información de materia:', materia);
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
    
    if (!id || id === 'Buscando...') {
        alert('No hay materia seleccionada para eliminar');
        return;
    }
    
    eliminarMateriaPorId(id);
}

function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    
    if (!inputNombre) {
        alert('No se encontró el campo de nombre');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    
    if (!nombre) {
        alert('El nombre es obligatorio');
        return;
    }
    
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    const originalText = btnGuardar ? btnGuardar.innerHTML : '';
    
    if (btnGuardar) {
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = 'Enviando...';
    }
    
    const datos = { nombre: nombre };
    
    console.log('Enviando datos:', datos);
    
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('Respuesta recibida');
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data);
        
        // RESTAURAR BOTÓN SIEMPRE
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = originalText;
        }
        
        if (data.success) {
            alert(data.message);
            inputNombre.value = '';
            
            const inputId = document.getElementById('materia-id');
            if (inputId) inputId.value = '';
            
            if (document.querySelector('tbody')) {
                cargarMaterias();
            }
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error completo:', error);
        
        // RESTAURAR BOTÓN EN CASO DE ERROR
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = originalText;
        }
        alert('Error de conexión con el servidor');
    });
}

function eliminarMateriaPorId(id) {
    if (!id || isNaN(id)) {
        alert('ID no válido');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar esta materia?')) {
        return;
    }
    
    id = parseInt(id);
    
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            
            const infoMateria = document.getElementById('info-materia');
            if (infoMateria) {
                infoMateria.style.display = 'none';
                document.getElementById('buscar-nombre').value = '';
            }
            
            if (document.querySelector('tbody')) {
                cargarMaterias();
            }
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error de conexión');
    });
}

window.registrarMateria = registrarMateria;
window.eliminarMateriaPorId = eliminarMateriaPorId;
window.cargarMaterias = cargarMaterias;
window.buscarMateriaPorNombre = buscarMateriaPorNombre;
window.confirmarEliminacion = confirmarEliminacion;