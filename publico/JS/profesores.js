// profesores.js - Frontend JavaScript para profesores

const API_BASE_URL = window.location.origin + '/api/profesores';
console.log('API URL:', API_BASE_URL);
let profesorActual = null;

// ========== FUNCIONES GENERALES ==========

function mostrarMensaje(elementId, mensaje, tipo = 'success') {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.className = `mensaje ${tipo}`;
        elemento.style.display = 'block';
        setTimeout(() => elemento.style.display = 'none', 5000);
    }
}

// ========== REGISTRAR PROFESOR ==========

async function guardarProfesor() {
    console.log('=== GUARDAR PROFESOR ===');
    
    const numeroControl = document.getElementById('numero_de_control_ingresar')?.value.trim();
    const nombre = document.getElementById('nombre_ingresar')?.value.trim();
    const especialidad = document.getElementById('especialidad_ingresar')?.value.trim();
    
    console.log('Datos:', { numeroControl, nombre, especialidad });
    
    if (!numeroControl || !nombre || !especialidad) {
        mostrarMensaje('mensaje-ingresar', 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        console.log('Enviando POST a:', `${API_BASE_URL}/registrar`);
        
        const response = await fetch(`${API_BASE_URL}/registrar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                numero_de_control: numeroControl,
                nombre: nombre,
                especialidad: especialidad
            })
        });
        
        console.log('Respuesta status:', response.status);
        
        const result = await response.json();
        console.log('Resultado:', result);
        
        if (result.success) {
            mostrarMensaje('mensaje-ingresar', '✅ ' + result.message, 'success');
            document.getElementById('formulario-ingresar').reset();
        } else {
            mostrarMensaje('mensaje-ingresar', '❌ ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-ingresar', '❌ Error de conexión', 'error');
    }
}

// ========== BUSCAR PROFESOR (para Buscar_profesores.html) ==========

async function buscarProfesor() {
    console.log('=== BUSCAR PROFESOR ===');
    
    const numeroControl = document.getElementById('busqueda-numero')?.value.trim();
    console.log('Buscando número:', numeroControl);
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-busqueda', '❌ Ingrese un número de control', 'error');
        return;
    }
    
    try {
        console.log('Llamando API:', `${API_BASE_URL}/buscar/${numeroControl}`);
        
        const response = await fetch(`${API_BASE_URL}/buscar/${numeroControl}`);
        console.log('Respuesta status:', response.status);
        
        const result = await response.json();
        console.log('Resultado búsqueda:', result);
        
        const resultadosDiv = document.getElementById('resultados-busqueda');
        const datosDiv = document.getElementById('datos-profesor');
        
        if (!resultadosDiv || !datosDiv) {
            console.error('Elementos HTML no encontrados');
            return;
        }
        
        if (result.success) {
            const profesor = result.profesor;
            console.log('Profesor encontrado:', profesor);
            
            datosDiv.innerHTML = `
                <table class="tabla-profesor" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Número de Control</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${profesor.numero_de_control}</td>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Nombre</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${profesor.nombre}</td>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Especialidad</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${profesor.especialidad}</td>
                    </tr>
                </table>
            `;
            resultadosDiv.style.display = 'block';
            mostrarMensaje('mensaje-busqueda', '✅ Profesor encontrado', 'success');
        } else {
            datosDiv.innerHTML = '';
            resultadosDiv.style.display = 'none';
            mostrarMensaje('mensaje-busqueda', '❌ ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-busqueda', '❌ Error de conexión', 'error');
    }
}

// ========== BUSCAR PARA ELIMINAR (para Eliminar_profesores.html) ==========

async function buscarProfesorEliminar() {
    console.log('=== BUSCAR PARA ELIMINAR ===');
    
    const numeroControl = document.getElementById('eliminar-numero')?.value.trim();
    console.log('Buscando para eliminar:', numeroControl);
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-eliminar', '❌ Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/buscar/${numeroControl}`);
        console.log('Respuesta status:', response.status);
        
        const result = await response.json();
        console.log('Resultado:', result);
        
        const datosDiv = document.getElementById('datos-profesor');
        const infoDiv = document.getElementById('info-profesor');
        const confirmarBtn = document.getElementById('btn-eliminar-confirmar');
        
        if (!datosDiv || !infoDiv || !confirmarBtn) {
            console.error('Elementos HTML no encontrados');
            return;
        }
        
        if (result.success) {
            profesorActual = result.profesor;
            console.log('Profesor para eliminar:', profesorActual);
            
            infoDiv.innerHTML = `
                <table class="tabla-profesor" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Número de Control</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${profesorActual.numero_de_control}</td>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Nombre</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${profesorActual.nombre}</td>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Especialidad</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${profesorActual.especialidad}</td>
                    </tr>
                </table>
                <p style="color: red; margin-top: 10px; font-weight: bold;">
                    ⚠️ ¿Está seguro que desea eliminar este profesor?
                </p>
            `;
            datosDiv.style.display = 'block';
            confirmarBtn.style.display = 'block';
            mostrarMensaje('mensaje-eliminar', '✅ Profesor encontrado', 'success');
        } else {
            datosDiv.style.display = 'none';
            confirmarBtn.style.display = 'none';
            mostrarMensaje('mensaje-eliminar', '❌ ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-eliminar', '❌ Error de conexión', 'error');
    }
}

// ========== ELIMINAR PROFESOR CONFIRMADO ==========

async function eliminarProfesorConfirmado() {
    console.log('=== ELIMINAR CONFIRMADO ===');
    
    if (!profesorActual) {
        mostrarMensaje('mensaje-eliminar', '❌ No hay profesor seleccionado', 'error');
        return;
    }
    
    console.log('Eliminando profesor:', profesorActual.numero_de_control);
    
    try {
        const response = await fetch(`${API_BASE_URL}/eliminar/${profesorActual.numero_de_control}`, {
            method: 'DELETE'
        });
        
        console.log('Respuesta status:', response.status);
        
        const result = await response.json();
        console.log('Resultado eliminación:', result);
        
        if (result.success) {
            mostrarMensaje('mensaje-eliminar', '✅ ' + result.message, 'success');
            
            // Limpiar formulario y ocultar sección
            if (document.getElementById('eliminar-numero')) {
                document.getElementById('eliminar-numero').value = '';
            }
            if (document.getElementById('datos-profesor')) {
                document.getElementById('datos-profesor').style.display = 'none';
            }
            if (document.getElementById('btn-eliminar-confirmar')) {
                document.getElementById('btn-eliminar-confirmar').style.display = 'none';
            }
            
            profesorActual = null;
        } else {
            mostrarMensaje('mensaje-eliminar', '❌ ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-eliminar', '❌ Error de conexión', 'error');
    }
}

// ========== BUSCAR PARA ACTUALIZAR (para Actualizar_profesores.html) ==========

async function buscarProfesorActualizar() {
    console.log('=== BUSCAR PARA ACTUALIZAR ===');
    
    const numeroControl = document.getElementById('actualizar-numero')?.value.trim();
    console.log('Buscando para actualizar:', numeroControl);
    
    if (!numeroControl) {
        mostrarMensaje('mensaje-actualizar', '❌ Ingrese un número de control', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/buscar/${numeroControl}`);
        console.log('Respuesta status:', response.status);
        
        const result = await response.json();
        console.log('Resultado:', result);
        
        const formulario = document.getElementById('formulario-actualizar');
        
        if (!formulario) {
            console.error('Formulario no encontrado');
            return;
        }
        
        if (result.success) {
            profesorActual = result.profesor;
            console.log('Profesor para actualizar:', profesorActual);
            
            // Llenar formulario con datos actuales
            document.getElementById('numero_original').value = profesorActual.numero_de_control;
            document.getElementById('nombre_actualizar').value = profesorActual.nombre;
            document.getElementById('especialidad_actualizar').value = profesorActual.especialidad;
            
            // Mostrar formulario
            formulario.style.display = 'block';
            mostrarMensaje('mensaje-actualizar', '✅ Profesor encontrado. Puede modificar los datos.', 'success');
        } else {
            formulario.style.display = 'none';
            mostrarMensaje('mensaje-actualizar', '❌ ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-actualizar', '❌ Error de conexión', 'error');
    }
}

// ========== ACTUALIZAR PROFESOR ==========

async function actualizarProfesor() {
    console.log('=== ACTUALIZAR PROFESOR ===');
    
    const numeroOriginal = document.getElementById('numero_original')?.value;
    const nombre = document.getElementById('nombre_actualizar')?.value.trim();
    const especialidad = document.getElementById('especialidad_actualizar')?.value.trim();
    
    console.log('Datos para actualizar:', { numeroOriginal, nombre, especialidad });
    
    if (!numeroOriginal || !nombre || !especialidad) {
        mostrarMensaje('mensaje-actualizar', '❌ Todos los campos son obligatorios', 'error');
        return;
    }
    
    try {
        console.log('Enviando PUT a:', `${API_BASE_URL}/actualizar/${numeroOriginal}`);
        
        const response = await fetch(`${API_BASE_URL}/actualizar/${numeroOriginal}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nombre: nombre,
                especialidad: especialidad
            })
        });
        
        console.log('Respuesta status:', response.status);
        
        const result = await response.json();
        console.log('Resultado actualización:', result);
        
        if (result.success) {
            mostrarMensaje('mensaje-actualizar', '✅ ' + result.message, 'success');
            
            // Limpiar y ocultar formulario después de actualizar
            setTimeout(() => {
                if (document.getElementById('actualizar-numero')) {
                    document.getElementById('actualizar-numero').value = '';
                }
                if (document.getElementById('formulario-actualizar')) {
                    document.getElementById('formulario-actualizar').style.display = 'none';
                }
                if (document.getElementById('formulario-actualizar')) {
                    document.getElementById('formulario-actualizar').reset();
                }
                profesorActual = null;
            }, 2000);
        } else {
            mostrarMensaje('mensaje-actualizar', '❌ ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensaje-actualizar', '❌ Error de conexión', 'error');
    }
}

// ========== HACER FUNCIONES GLOBALES ==========
window.guardarProfesor = guardarProfesor;
window.buscarProfesor = buscarProfesor;
window.buscarProfesorEliminar = buscarProfesorEliminar;
window.eliminarProfesorConfirmado = eliminarProfesorConfirmado;
window.buscarProfesorActualizar = buscarProfesorActualizar;
window.actualizarProfesor = actualizarProfesor;

console.log('✅ profesores.js cargado correctamente');