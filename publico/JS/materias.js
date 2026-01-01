// publico/JS/materias.js - VERSIÓN SIMPLIFICADA

document.addEventListener('DOMContentLoaded', function() {
    console.log('Materias JS - Iniciando...');
    
    // Verificar que estamos en la página correcta
    const formMateria = document.getElementById('form-materia');
    const tablaMaterias = document.getElementById('tabla-materias');
    
    if (!formMateria && !tablaMaterias) {
        console.log('No es una página de materias, saliendo...');
        return;
    }
    
    // Inicializar según la página
    if (formMateria) {
        console.log('Página de formulario detectada');
        inicializarFormulario();
    }
    
    if (tablaMaterias) {
        console.log('Página de lista detectada');
        inicializarLista();
    }
});

function inicializarFormulario() {
    console.log('Inicializando formulario de materia...');
    
    const form = document.getElementById('form-materia');
    const btnGuardar = document.getElementById('btn-guardar');
    
    if (!form || !btnGuardar) {
        console.error('Elementos del formulario no encontrados');
        return;
    }
    
    // Configurar evento del botón guardar
    btnGuardar.addEventListener('click', function(e) {
        e.preventDefault();
        registrarMateria();
    });
    
    console.log('Formulario inicializado correctamente');
}

function inicializarLista() {
    console.log('Inicializando lista de materias...');
    
    const tabla = document.getElementById('tabla-materias');
    const tbody = tabla ? tabla.getElementsByTagName('tbody')[0] : null;
    
    if (!tbody) {
        console.error('Tabla de materias no encontrada');
        return;
    }
    
    // Cargar materias inicialmente
    cargarListaMaterias();
    
    console.log('Lista inicializada correctamente');
}

function cargarListaMaterias() {
    console.log('Cargando lista de materias...');
    
    const tbody = document.getElementById('tabla-materias')?.getElementsByTagName('tbody')[0];
    if (!tbody) return;
    
    // Mostrar loading
    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                Cargando materias...
            </td>
        </tr>
    `;
    
    // RUTA CORREGIDA
    fetch('../APIS/materias.api.js/listar', {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos de materias recibidos:', data);
        
        if (data.success && data.materias) {
            mostrarMateriasEnTabla(data.materias);
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger">
                        ${data.message || 'No se pudieron cargar las materias'}
                    </td>
                </tr>
            `;
        }
    })
    .catch(error => {
        console.error('Error al cargar materias:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger">
                    Error de conexión
                </td>
            </tr>
        `;
    });
}

function mostrarMateriasEnTabla(materias) {
    const tbody = document.getElementById('tabla-materias')?.getElementsByTagName('tbody')[0];
    if (!tbody) return;
    
    if (!materias || materias.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No se encontraron materias
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    materias.forEach(materia => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${materia.id || ''}</td>
            <td>${materia.nombre || ''}</td>
            <td>${materia.estado || 'activo'}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${materia.id}">
                    Eliminar
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Agregar eventos a los botones de eliminar
    setTimeout(() => {
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                eliminarMateria(id);
            });
        });
    }, 100);
}

function registrarMateria() {
    console.log('Registrando materia...');
    
    const form = document.getElementById('form-materia');
    if (!form) return;
    
    // SOLO los campos que tienes en tu tabla
    const nombre = document.getElementById('nombre')?.value.trim();
    
    if (!nombre) {
        mostrarMensaje('El nombre es requerido', 'error');
        return;
    }
    
    // Datos SIMPLIFICADOS según tu estructura
    const formData = {
        nombre: nombre
        // Si tienes más campos, agrégalos aquí
        // codigo: document.getElementById('codigo')?.value.trim() || '',
    };
    
    console.log('Datos a enviar:', formData);
    
    const btnGuardar = document.getElementById('btn-guardar');
    if (btnGuardar) {
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = 'Guardando...';
    }
    
    // RUTA CORREGIDA
    fetch('../APIS/materias.api.js/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = 'Guardar';
        }
        
        if (data.success) {
            mostrarMensaje(data.message || 'Materia registrada exitosamente', 'success');
            form.reset();
            
            // Recargar lista si estamos en página de lista
            if (document.getElementById('tabla-materias')) {
                cargarListaMaterias();
            }
            
            // Notificar al padre si estamos en iframe
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'materiaRegistrada',
                    message: data.message
                }, '*');
            }
        } else {
            mostrarMensaje(data.message || 'Error al registrar la materia', 'error');
        }
    })
    .catch(error => {
        console.error('Error al registrar:', error);
        
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = 'Guardar';
        }
        
        mostrarMensaje('Error de conexión', 'error');
    });
}

function eliminarMateria(id) {
    if (!id) {
        console.error('ID de materia no proporcionado');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar esta materia?')) {
        return;
    }
    
    console.log('Eliminando materia ID:', id);
    
    // RUTA CORREGIDA
    fetch('../APIS/materias.api.js/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id }),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta de eliminación:', data);
        
        if (data.success) {
            mostrarMensaje(data.message || 'Materia eliminada exitosamente', 'success');
            // Recargar la lista
            cargarListaMaterias();
        } else {
            mostrarMensaje(data.message || 'Error al eliminar', 'error');
        }
    })
    .catch(error => {
        console.error('Error al eliminar:', error);
        mostrarMensaje('Error de conexión', 'error');
    });
}

function mostrarMensaje(mensaje, tipo = 'info') {
    console.log(`${tipo}: ${mensaje}`);
    
    // Mostrar alerta simple
    alert(mensaje);
}

// Exportar funciones globales
window.Materias = {
    registrarMateria: registrarMateria,
    eliminarMateria: eliminarMateria,
    cargarListaMaterias: cargarListaMaterias
};

console.log('materias.js cargado correctamente');