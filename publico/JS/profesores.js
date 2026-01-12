// publico/JS/profesores.js

const API_BASE = window.location.origin + '/api/profesores';

console.log('API Base configurada:', API_BASE);

// Función para mostrar mensajes
function mostrarMensaje(elementId, mensaje, tipo = 'success') {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = 'mensaje mensaje-' + tipo;
        elemento.style.display = 'block';
        
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// Función para manejar errores de fetch
async function handleFetch(url, options = {}) {
    try {
        console.log('Enviando petición a:', url);
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            }
        });
        
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en fetch:', error);
        throw error;
    }
}

// ========== REGISTRAR PROFESOR ==========
window.guardarProfesor = async function() {
    const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
    const nombre = document.getElementById('nombre_ingresar').value.trim();
    const especialidad = document.getElementById('especialidad_ingresar').value.trim();
    const mensajeDiv = document.getElementById('mensaje-ingresar');
    
    if (!numeroControl || !nombre || !especialidad) {
        mostrarMensaje('mensaje-ingresar', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (numeroControl.length !== 8) {
        mostrarMensaje('mensaje-ingresar', 'El número de control debe tener 8 caracteres', 'error');
        return;
    }
    
    try {
        const result = await handleFetch(API_BASE + '/registrar', {
            method: 'POST',
            body: JSON.stringify({
                numero_de_control: numeroControl,
                nombre: nombre,
                especialidad: especialidad
            })
        });
        
        if (result.success) {
            mostrarMensaje('mensaje-ingresar', result.message, 'success');
            document.getElementById('formulario-ingresar').reset();
        } else {
            mostrarMensaje('mensaje-ingresar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al registrar profesor:', error);
        mostrarMensaje('mensaje-ingresar', 'Error de conexión: ' + error.message, 'error');
    }
};

// ========== BUSCAR PROFESOR ==========
window.buscarProfesor = async function() {
    const numeroControl = document.getElementById('busqueda-numero').value.trim();
    const resultadosDiv = document.getElementById('resultados-busqueda');
    const datosDiv = document.getElementById('datos-profesor');
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-busqueda', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const result = await handleFetch(API_BASE + '/buscar/' + encodeURIComponent(numeroControl));
        
        if (result.success) {
            const profesor = result.profesor;
            datosDiv.innerHTML = `
                <table class="tabla-profesor">
                    <tr>
                        <th>Número de Control</th>
                        <td>${profesor.numero_de_control}</td>
                    </tr>
                    <tr>
                        <th>Nombre</th>
                        <td>${profesor.nombre}</td>
                    </tr>
                    <tr>
                        <th>Especialidad</th>
                        <td>${profesor.especialidad}</td>
                    </tr>
                </table>
            `;
            resultadosDiv.style.display = 'block';
            mostrarMensaje('mensaje-busqueda', 'Profesor encontrado', 'success');
        } else {
            datosDiv.innerHTML = '';
            resultadosDiv.style.display = 'none';
            mostrarMensaje('mensaje-busqueda', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al buscar profesor:', error);
        mostrarMensaje('mensaje-busqueda', 'Error de conexión: ' + error.message, 'error');
    }
};

// ========== LISTAR TODOS LOS PROFESORES ==========
window.listarTodosProfesores = async function() {
    const listaDiv = document.getElementById('lista-profesores');
    const resultadosDiv = document.getElementById('resultados-busqueda');
    const contadorDiv = document.getElementById('contador-profesores');
    const tablaContenedor = document.getElementById('tabla-profesores-contenedor');
    
    resultadosDiv.style.display = 'none';
    
    try {
        const result = await handleFetch(API_BASE + '/listar');
        
        if (result.success && result.profesores.length > 0) {
            let tablaHTML = `
                <table class="tabla-profesor" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Número de Control</th>
                            <th>Nombre</th>
                            <th>Especialidad</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            result.profesores.forEach(profesor => {
                tablaHTML += `
                    <tr>
                        <td>${profesor.numero_de_control}</td>
                        <td>${profesor.nombre}</td>
                        <td>${profesor.especialidad}</td>
                    </tr>`;
            });
            
            tablaHTML += `</tbody></table>`;
            
            tablaContenedor.innerHTML = tablaHTML;
            contadorDiv.innerHTML = `<p>Total de profesores: ${result.total}</p>`;
            listaDiv.style.display = 'block';
            mostrarMensaje('mensaje-busqueda', `Se encontraron ${result.total} profesores`, 'success');
        } else {
            tablaContenedor.innerHTML = '';
            contadorDiv.innerHTML = '<p>No hay profesores registrados</p>';
            listaDiv.style.display = 'block';
            mostrarMensaje('mensaje-busqueda', 'No hay profesores registrados', 'info');
        }
    } catch (error) {
        console.error('Error al listar profesores:', error);
        mostrarMensaje('mensaje-busqueda', 'Error de conexión: ' + error.message, 'error');
    }
};

// ========== BUSCAR PARA ACTUALIZAR ==========
window.buscarProfesorActualizar = async function() {
    const numeroControl = document.getElementById('actualizar-numero').value.trim();
    const formulario = document.getElementById('formulario-actualizar');
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-actualizar', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const result = await handleFetch(API_BASE + '/buscar/' + encodeURIComponent(numeroControl));
        
        if (result.success) {
            const profesor = result.profesor;
            document.getElementById('numero_original').value = profesor.numero_de_control;
            document.getElementById('nombre_actualizar').value = profesor.nombre;
            document.getElementById('especialidad_actualizar').value = profesor.especialidad;
            
            formulario.style.display = 'block';
            mostrarMensaje('mensaje-actualizar', 'Profesor encontrado. Puede modificar los datos.', 'success');
        } else {
            formulario.style.display = 'none';
            mostrarMensaje('mensaje-actualizar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al buscar profesor para actualizar:', error);
        mostrarMensaje('mensaje-actualizar', 'Error de conexión: ' + error.message, 'error');
    }
};

// ========== ACTUALIZAR PROFESOR ==========
window.actualizarProfesor = async function() {
    const numeroOriginal = document.getElementById('numero_original').value;
    const nombre = document.getElementById('nombre_actualizar').value.trim();
    const especialidad = document.getElementById('especialidad_actualizar').value.trim();
    
    if (!numeroOriginal || !nombre || !especialidad) {
        mostrarMensaje('mensaje-actualizar', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        const result = await handleFetch(API_BASE + '/actualizar', {
            method: 'PUT',
            body: JSON.stringify({
                numero_de_control: numeroOriginal,
                nombre: nombre,
                especialidad: especialidad
            })
        });
        
        if (result.success) {
            mostrarMensaje('mensaje-actualizar', result.message, 'success');
            
            setTimeout(() => {
                document.getElementById('actualizar-numero').value = '';
                document.getElementById('formulario-actualizar').style.display = 'none';
                document.getElementById('formulario-actualizar').reset();
                document.getElementById('numero_original').value = '';
            }, 2000);
        } else {
            mostrarMensaje('mensaje-actualizar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al actualizar profesor:', error);
        mostrarMensaje('mensaje-actualizar', 'Error de conexión: ' + error.message, 'error');
    }
};

// ========== ELIMINAR PROFESOR ==========
window.buscarProfesorEliminar = async function() {
    const numeroControl = document.getElementById('eliminar-numero').value.trim();
    const datosDiv = document.getElementById('datos-profesor');
    const infoDiv = document.getElementById('info-profesor');
    const confirmarBtn = document.getElementById('btn-eliminar-confirmar');
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-eliminar', 'Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const result = await handleFetch(API_BASE + '/buscar/' + encodeURIComponent(numeroControl));
        
        if (result.success) {
            const profesor = result.profesor;
            infoDiv.innerHTML = `
                <table class="tabla-profesor">
                    <tr>
                        <th>Número de Control</th>
                        <td>${profesor.numero_de_control}</td>
                    </tr>
                    <tr>
                        <th>Nombre</th>
                        <td>${profesor.nombre}</td>
                    </tr>
                    <tr>
                        <th>Especialidad</th>
                        <td>${profesor.especialidad}</td>
                    </tr>
                </table>
            `;
            datosDiv.style.display = 'block';
            confirmarBtn.style.display = 'block';
            confirmarBtn.dataset.numero = profesor.numero_de_control;
            
            mostrarMensaje('mensaje-eliminar', 'Profesor encontrado. Confirme para eliminar.', 'success');
        } else {
            datosDiv.style.display = 'none';
            confirmarBtn.style.display = 'none';
            mostrarMensaje('mensaje-eliminar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al buscar profesor para eliminar:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexión: ' + error.message, 'error');
    }
};

window.eliminarProfesorConfirmado = async function() {
    const numeroControl = document.getElementById('btn-eliminar-confirmar').dataset.numero;
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-eliminar', 'No hay profesor seleccionado', 'error');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar este profesor?\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const result = await handleFetch(API_BASE + '/eliminar', {
            method: 'DELETE',
            body: JSON.stringify({ numero_de_control: numeroControl })
        });
        
        if (result.success) {
            mostrarMensaje('mensaje-eliminar', result.message, 'success');
            
            setTimeout(() => {
                document.getElementById('eliminar-numero').value = '';
                document.getElementById('datos-profesor').style.display = 'none';
                document.getElementById('btn-eliminar-confirmar').style.display = 'none';
                document.getElementById('info-profesor').innerHTML = '';
                delete document.getElementById('btn-eliminar-confirmar').dataset.numero;
            }, 1500);
        } else {
            mostrarMensaje('mensaje-eliminar', result.message, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        mostrarMensaje('mensaje-eliminar', 'Error de conexión: ' + error.message, 'error');
    }
};