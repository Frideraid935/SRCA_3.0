// profesores-crud.js - CRUD completo para profesores
const API_PROFESORES = '/api/profesores';

// ==================== FUNCIONES COMUNES ====================
function mostrarMensaje(elementoId, texto, tipo) {
    const elemento = document.getElementById(elementoId);
    if (!elemento) return;
    
    elemento.textContent = texto;
    elemento.className = `mensaje mensaje-${tipo}`;
    elemento.style.display = 'block';
    
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}

// ==================== REGISTRAR PROFESOR ====================
if (document.getElementById('numero_de_control_ingresar')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Página Registrar Profesor cargada');
    });
}

function guardarProfesor() {
    const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
    const nombre = document.getElementById('nombre_ingresar').value.trim();
    const especialidad = document.getElementById('especialidad_ingresar').value.trim();

    if (!numeroControl || !nombre || !especialidad) {
        mostrarMensaje('mensaje-ingresar', 'Todos los campos son obligatorios', 'error');
        return;
    }

    const datos = {
        numero_de_control: numeroControl,
        nombre: nombre,
        especialidad: especialidad
    };

    fetch(`${API_PROFESORES}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje('mensaje-ingresar', data.message, 'success');
            document.getElementById('formulario-ingresar').reset();
        } else {
            mostrarMensaje('mensaje-ingresar', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('mensaje-ingresar', 'Error de conexión', 'error');
    });
}

// ==================== BUSCAR PROFESOR ====================
if (document.getElementById('btn-buscar')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Página Buscar Profesor cargada');
        document.getElementById('btn-buscar').addEventListener('click', buscarProfesor);
    });
}

function buscarProfesor() {
    const numeroControl = document.getElementById('busqueda-numero').value.trim();

    if (!numeroControl) {
        mostrarMensaje('mensaje-busqueda', 'Ingrese un número de control', 'error');
        document.getElementById('resultados-busqueda').style.display = 'none';
        return;
    }

    fetch(`${API_PROFESORES}/buscar/${numeroControl}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.profesor) {
                document.getElementById('datos-profesor').innerHTML = `
                    <table class="tabla-profesor">
                        <tr><th>Número de Control</th><td>${data.profesor.numero_de_control}</td></tr>
                        <tr><th>Nombre</th><td>${data.profesor.nombre}</td></tr>
                        <tr><th>Especialidad</th><td>${data.profesor.especialidad}</td></tr>
                    </table>
                `;
                
                document.getElementById('resultados-busqueda').style.display = 'block';
                mostrarMensaje('mensaje-busqueda', 'Profesor encontrado', 'success');
            } else {
                mostrarMensaje('mensaje-busqueda', data.message || 'Profesor no encontrado', 'error');
                document.getElementById('resultados-busqueda').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('mensaje-busqueda', 'Error de conexión', 'error');
            document.getElementById('resultados-busqueda').style.display = 'none';
        });
}

// ==================== ACTUALIZAR PROFESOR ====================
if (document.getElementById('btn-buscar-actualizar')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Página Actualizar Profesor cargada');
        document.getElementById('btn-buscar-actualizar').addEventListener('click', buscarProfesorActualizar);
    });
}

function buscarProfesorActualizar() {
    const numeroControl = document.getElementById('actualizar-numero').value.trim();

    if (!numeroControl) {
        mostrarMensaje('mensaje-actualizar', 'Ingrese un número de control', 'error');
        document.getElementById('formulario-actualizar').style.display = 'none';
        return;
    }

    fetch(`${API_PROFESORES}/buscar/${numeroControl}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.profesor) {
                document.getElementById('numero_original').value = data.profesor.numero_de_control;
                document.getElementById('nombre_actualizar').value = data.profesor.nombre;
                document.getElementById('especialidad_actualizar').value = data.profesor.especialidad;
                
                document.getElementById('formulario-actualizar').style.display = 'block';
                mostrarMensaje('mensaje-actualizar', 'Profesor encontrado', 'success');
            } else {
                mostrarMensaje('mensaje-actualizar', data.message || 'Profesor no encontrado', 'error');
                document.getElementById('formulario-actualizar').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('mensaje-actualizar', 'Error de conexión', 'error');
            document.getElementById('formulario-actualizar').style.display = 'none';
        });
}

function actualizarProfesor() {
    const numeroOriginal = document.getElementById('numero_original').value;
    const nombre = document.getElementById('nombre_actualizar').value.trim();
    const especialidad = document.getElementById('especialidad_actualizar').value.trim();

    if (!nombre || !especialidad) {
        mostrarMensaje('mensaje-actualizar', 'Todos los campos son obligatorios', 'error');
        return;
    }

    const datos = { nombre, especialidad };

    fetch(`${API_PROFESORES}/actualizar/${numeroOriginal}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje('mensaje-actualizar', data.message, 'success');
            document.getElementById('actualizar-numero').value = '';
            document.getElementById('formulario-actualizar').reset();
            document.getElementById('formulario-actualizar').style.display = 'none';
        } else {
            mostrarMensaje('mensaje-actualizar', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('mensaje-actualizar', 'Error de conexión', 'error');
    });
}

// ==================== ELIMINAR PROFESOR ====================
if (document.getElementById('btn-buscar-eliminar')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Página Eliminar Profesor cargada');
        document.getElementById('btn-buscar-eliminar').addEventListener('click', buscarProfesorEliminar);
        document.getElementById('btn-eliminar-confirmar').addEventListener('click', confirmarEliminacion);
    });
}

function buscarProfesorEliminar() {
    const numeroControl = document.getElementById('eliminar-numero').value.trim();

    if (!numeroControl) {
        mostrarMensaje('mensaje-eliminar', 'Ingrese un número de control', 'error');
        document.getElementById('datos-profesor').style.display = 'none';
        return;
    }

    fetch(`${API_PROFESORES}/buscar/${numeroControl}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.profesor) {
                document.getElementById('info-profesor').innerHTML = `
                    <table class="tabla-profesor">
                        <tr><th>Número de Control</th><td>${data.profesor.numero_de_control}</td></tr>
                        <tr><th>Nombre</th><td>${data.profesor.nombre}</td></tr>
                        <tr><th>Especialidad</th><td>${data.profesor.especialidad}</td></tr>
                    </table>
                `;
                
                document.getElementById('datos-profesor').style.display = 'block';
                document.getElementById('btn-eliminar-confirmar').style.display = 'block';
                mostrarMensaje('mensaje-eliminar', 'Profesor encontrado', 'success');
            } else {
                mostrarMensaje('mensaje-eliminar', data.message || 'Profesor no encontrado', 'error');
                document.getElementById('datos-profesor').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('mensaje-eliminar', 'Error de conexión', 'error');
            document.getElementById('datos-profesor').style.display = 'none';
        });
}

function confirmarEliminacion() {
    const numeroControl = document.getElementById('eliminar-numero').value.trim();
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-eliminar', 'No hay profesor seleccionado', 'error');
        return;
    }

    if (!confirm('¿Está seguro de eliminar este profesor?')) {
        return;
    }

    fetch(`${API_PROFESORES}/eliminar/${numeroControl}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje('mensaje-eliminar', data.message, 'success');
            document.getElementById('eliminar-numero').value = '';
            document.getElementById('datos-profesor').style.display = 'none';
            document.getElementById('btn-eliminar-confirmar').style.display = 'none';
        } else {
            mostrarMensaje('mensaje-eliminar', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexión', 'error');
    });
}