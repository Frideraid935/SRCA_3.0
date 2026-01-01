// publico/JS/materias.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('materias.js cargado');
    
    // Verificar si estamos en formulario de registro
    if (document.querySelector('input[name="nombre"], #nombre, [id*="nombre"]')) {
        console.log('Formulario de registro detectado');
        configurarFormulario();
    }
    
    // Verificar si estamos en página de lista
    if (document.querySelector('table, #tabla-materias, #tablaMaterias')) {
        console.log('Tabla de materias detectada');
        configurarTabla();
    }
});

function configurarFormulario() {
    console.log('Configurando formulario...');
    
    // Buscar botón de guardar de diferentes maneras
    const btnGuardar = document.querySelector('#btnGuardar, #btn-guardar, button[type="submit"], button:contains("Guardar"), button:contains("Registrar")');
    const inputNombre = document.querySelector('#nombre, input[name="nombre"], [id*="nombre"]');
    
    if (!btnGuardar || !inputNombre) {
        console.error('No se encontraron elementos del formulario');
        return;
    }
    
    btnGuardar.addEventListener('click', function(e) {
        e.preventDefault();
        registrarMateria();
    });
    
    console.log('Formulario configurado');
}

function configurarTabla() {
    console.log('Configurando tabla...');
    
    // Cargar materias inicialmente
    cargarMaterias();
    
    // Configurar eventos de eliminación después de cargar
    setTimeout(() => {
        document.querySelectorAll('.btn-eliminar, button:contains("Eliminar")').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id') || this.closest('tr').querySelector('td:first-child')?.textContent;
                if (id) eliminarMateria(id);
            });
        });
    }, 1000);
}

function cargarMaterias() {
    console.log('Cargando materias...');
    
    const tablaBody = document.querySelector('tbody');
    if (!tablaBody) {
        console.error('No se encontró tbody en la tabla');
        return;
    }
    
    tablaBody.innerHTML = '<tr><td colspan="3">Cargando materias...</td></tr>';
    
    fetch('/api/materias/listar', {
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error: ' + response.status);
        return response.json();
    })
    .then(data => {
        console.log('Respuesta:', data);
        
        if (data.success && data.materias) {
            mostrarMaterias(data.materias);
        } else {
            alert('Error: ' + (data.message || 'No se pudieron cargar las materias'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión al servidor');
    });
}

function mostrarMaterias(materias) {
    const tablaBody = document.querySelector('tbody');
    if (!tablaBody) return;
    
    if (!materias || materias.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="3">No hay materias registradas</td></tr>';
        return;
    }
    
    tablaBody.innerHTML = '';
    
    materias.forEach(materia => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${materia.id}</td>
            <td>${materia.nombre}</td>
            <td>
                <button class="btn-eliminar" data-id="${materia.id}">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
    
    // Re-configurar eventos de eliminación
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            eliminarMateria(id);
        });
    });
}

function registrarMateria() {
    const inputNombre = document.querySelector('#nombre, input[name="nombre"]');
    if (!inputNombre) {
        alert('No se encontró el campo nombre');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre es requerido');
        return;
    }
    
    const btnGuardar = document.querySelector('#btnGuardar, #btn-guardar, button[type="submit"]');
    if (btnGuardar) {
        btnGuardar.disabled = true;
        btnGuardar.textContent = 'Guardando...';
    }
    
    const formData = { nombre: nombre };
    
    console.log('Enviando datos:', formData);
    
    fetch('/api/materias/registrar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error: ' + response.status);
        return response.json();
    })
    .then(data => {
        console.log('Respuesta:', data);
        
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar';
        }
        
        if (data.success) {
            alert(' ' + data.message);
            inputNombre.value = '';
            
            // Si estamos en una tabla, recargarla
            if (document.querySelector('tbody')) {
                cargarMaterias();
            }
        } else {
            alert(' ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar';
        }
        alert('Error de conexión');
    });
}

function eliminarMateria(id) {
    if (!id) {
        alert('ID no válido');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar esta materia?')) {
        return;
    }
    
    console.log('Eliminando materia ID:', id);
    
    fetch('/api/materias/eliminar', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: id }),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error: ' + response.status);
        return response.json();
    })
    .then(data => {
        console.log('Respuesta:', data);
        
        if (data.success) {
            alert(' ' + data.message);
            cargarMaterias();
        } else {
            alert(' ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión');
    });
}

// Hacer funciones disponibles globalmente
window.registrarMateria = registrarMateria;
window.eliminarMateria = eliminarMateria;
window.cargarMaterias = cargarMaterias;