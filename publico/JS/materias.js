// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formulario-ingresar');
    if (form) {
        configurarFormulario(form);
    }
    
    const table = document.querySelector('table');
    if (table) {
        cargarMaterias();
    }
});

function configurarFormulario(form) {
    const btnGuardar = form.querySelector('button[type="submit"]');
    
    if (!btnGuardar) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        registrarMateria();
    });
}

function cargarMaterias() {
    const tbody = document.querySelector('tbody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';
    }
    
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
                <button onclick="eliminarMateria(${materia.id})" class="btn btn-danger btn-sm">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
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
    
    const btnGuardar = document.querySelector('button[type="submit"]');
    if (btnGuardar) {
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = 'Enviando...';
    }
    
    const datos = { nombre: nombre };
    
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = 'Registrar';
        }
        
        if (data.success) {
            alert(data.message);
            inputNombre.value = '';
            
            const inputId = document.getElementById('materia-id');
            if (inputId) inputId.value = '';
            
            if (document.querySelector('tbody')) {
                cargarMaterias();
            }
            
            const mensajeDiv = document.getElementById('mensaje-ingresar');
            if (mensajeDiv) {
                mensajeDiv.innerHTML = '<div class="alert alert-success">' + data.message + '</div>';
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = 'Registrar';
        }
        alert('Error de conexión');
    });
}

function eliminarMateria(id) {
    if (!id) return;
    
    if (!confirm('¿Eliminar esta materia?')) return;
    
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            cargarMaterias();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        alert('Error de conexión');
    });
}

window.registrarMateria = registrarMateria;
window.eliminarMateria = eliminarMateria;
window.cargarMaterias = cargarMaterias;