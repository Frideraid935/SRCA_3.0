// publico/JS/materias.js - VERSIÓN DEFINITIVA

// Variable global para configurar rutas
const API_BASE_URL = '/api/materias'; // ¡ESTO ES CLAVE!

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== MATERIAS.JS INICIADO ===');
    
    // 1. Buscar formulario de registro
    const form = document.querySelector('form');
    if (form) {
        console.log('Formulario encontrado');
        configurarFormulario(form);
    }
    
    // 2. Buscar tabla de materias
    const table = document.querySelector('table');
    if (table) {
        console.log('Tabla encontrada');
        cargarMaterias();
    }
});

function configurarFormulario(form) {
    // Buscar botón de guardar
    const btnGuardar = form.querySelector('button[type="submit"], button');
    
    if (!btnGuardar) {
        console.error('No hay botón en el formulario');
        return;
    }
    
    // Prevenir envío normal del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
    });
    
    // Asignar evento al botón
    btnGuardar.addEventListener('click', function() {
        registrarMateria();
    });
    
    console.log('Formulario configurado');
}

function cargarMaterias() {
    console.log('Solicitando materias a:', API_BASE_URL + '/listar');
    
    const tbody = document.querySelector('tbody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';
    }
    
    fetch(API_BASE_URL + '/listar', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Respuesta status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data);
        
        if (data.success) {
            mostrarMaterias(data.materias || []);
        } else {
            alert('Error: ' + (data.message || 'No se pudieron cargar'));
        }
    })
    .catch(error => {
        console.error('Error fetch:', error);
        alert('No se pudo conectar al servidor');
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
                <button onclick="eliminarMateria(${materia.id})" style="color: red; border: 1px solid red; padding: 5px;">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function registrarMateria() {
    console.log('Intentando registrar materia...');
    
    // Buscar campo nombre
    const inputNombre = document.querySelector('#nombre, input[name="nombre"]');
    if (!inputNombre) {
        alert('ERROR: No se encontró campo "nombre"');
        console.error('No se encontró input nombre');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre es obligatorio');
        return;
    }
    
    const btnGuardar = document.querySelector('button[type="submit"], button');
    if (btnGuardar) {
        btnGuardar.disabled = true;
        btnGuardar.textContent = 'Enviando...';
    }
    
    const datos = {
        nombre: nombre
    };
    
    console.log('Enviando datos:', datos);
    console.log('URL:', API_BASE_URL + '/registrar');
    
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('Respuesta status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Respuesta completa:', data);
        
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar';
        }
        
        if (data.success) {
            alert('ÉXITO: ' + data.message);
            inputNombre.value = '';
            
            // Recargar lista si existe
            if (document.querySelector('table')) {
                cargarMaterias();
            }
        } else {
            alert('ERROR: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error completo:', error);
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar';
        }
        alert('Error de conexión con el servidor');
    });
}

function eliminarMateria(id) {
    if (!confirm('¿Eliminar esta materia?')) return;
    
    console.log('Eliminando ID:', id);
    
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta eliminación:', data);
        
        if (data.success) {
            alert('Materia eliminada');
            cargarMaterias();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error eliminación:', error);
        alert('Error de conexión');
    });
}

// Hacer funciones disponibles globalmente
window.registrarMateria = registrarMateria;
window.eliminarMateria = eliminarMateria;
window.cargarMaterias = cargarMaterias;

console.log('Funciones disponibles: registrarMateria(), eliminarMateria(id), cargarMaterias()');