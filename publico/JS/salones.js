const API_BASE = '/api/salones';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de salones cargado');

    // ================= REGISTRAR =================
    const formRegistrar = document.getElementById('formulario-salon');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', e => {
            e.preventDefault();
            registrarSalon();
        });
    }

    // ================= BUSCAR =================
    const formBuscar = document.getElementById('formulario-buscar-salon');
    if (formBuscar) {
        formBuscar.addEventListener('submit', e => {
            e.preventDefault();
            buscarSalon();
        });
    }

    // ================= ELIMINAR =================
    const formEliminar = document.getElementById('formulario-eliminar-salon');
    if (formEliminar) {
        formEliminar.addEventListener('submit', e => {
            e.preventDefault();
            eliminarSalon();
        });
    }
});

// ================= FUNCIONES =================

// ===== REGISTRAR =====
function registrarSalon() {
    // (MANTENIDO IGUAL - NO MODIFICAR)
    const nombre = document.getElementById('nombre_salon').value.trim();
    const capacidad = document.getElementById('capacidad').value.trim();
    const profesor_id = document.getElementById('numero_de_control').value.trim();
    const mensaje = document.getElementById('mensaje');

    if (!nombre || !capacidad || !profesor_id) {
        mostrarMensaje(mensaje, 'Todos los campos son obligatorios', 'error');
        return;
    }

    fetch(API_BASE + '/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, capacidad, profesor_id })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje(mensaje, data.message, 'success');
            document.getElementById('formulario-salon').reset();
        } else {
            mostrarMensaje(mensaje, data.message, 'error');
        }
    })
    .catch(() => {
        mostrarMensaje(mensaje, 'Error de conexión con el servidor', 'error');
    });
}

// ===== BUSCAR ===== (CORREGIDA)
async function buscarSalon() {
    console.log('=== INICIANDO BÚSQUEDA ===');
    
    const id = document.getElementById('id_salon').value.trim();
    const mensajeDiv = document.getElementById('mensaje-busqueda-salon');
    const contenedorDatos = document.getElementById('contenedor-datos-salon');
    const datosDiv = document.getElementById('datos-salon');
    
    console.log('ID ingresado:', id);
    console.log('Elemento mensajeDiv:', mensajeDiv);
    console.log('Elemento contenedorDatos:', contenedorDatos);
    console.log('Elemento datosDiv:', datosDiv);

    // Limpiar resultados anteriores
    if (mensajeDiv) mensajeDiv.style.display = 'none';
    if (contenedorDatos) contenedorDatos.style.display = 'none';
    if (datosDiv) datosDiv.innerHTML = '';

    if (!id) {
        console.log('Error: No se ingresó ID');
        mostrarMensaje(mensajeDiv, 'Debes ingresar un ID de salón', 'error');
        return;
    }

    // Mostrar cargando
    if (mensajeDiv) {
        mensajeDiv.innerHTML = ' Buscando salón...';
        mensajeDiv.className = 'mensaje mensaje-info';
        mensajeDiv.style.display = 'block';
    }

    try {
        console.log(`Haciendo fetch a: ${API_BASE}/buscar/${id}`);
        
        const response = await fetch(`${API_BASE}/buscar/${id}`);
        
        console.log('Respuesta recibida:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            url: response.url
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Datos JSON recibidos:', result);
        
        if (!result.success) {
            console.log('API devolvió success: false');
            mostrarMensaje(mensajeDiv, result.message || 'Salón no encontrado', 'error');
            return;
        }

        console.log('Datos del salón encontrado:', result.salon);
        
        // Mostrar los datos
        if (datosDiv && result.salon) {
            datosDiv.innerHTML = `
                <div class="dato-salon">
                    <p><strong>ID:</strong> ${result.salon.id || 'N/A'}</p>
                    <p><strong>Nombre del Salón:</strong> ${result.salon.nombre || 'N/A'}</p>
                    <p><strong>Capacidad:</strong> ${result.salon.capacidad || 'N/A'} personas</p>
                    <p><strong>Número de Control del Profesor:</strong> ${result.salon.profesor_id || 'N/A'}</p>
                </div>
            `;
        }
        
        // Mostrar contenedor de datos
        if (contenedorDatos) {
            contenedorDatos.style.display = 'block';
        }
        
        mostrarMensaje(mensajeDiv, 'Salón encontrado correctamente', 'success');
        
    } catch (error) {
        console.error('Error completo en búsqueda:', error);
        
        let mensajeError = 'Error de conexión con el servidor';
        if (error.message.includes('Failed to fetch')) {
            mensajeError = 'No se puede conectar al servidor. Verifica que el servidor esté corriendo.';
        } else if (error.message.includes('HTTP')) {
            mensajeError = `Error del servidor: ${error.message}`;
        }
        
        mostrarMensaje(mensajeDiv, mensajeError, 'error');
        
        // Mostrar más detalles en consola
        console.log('=== DETALLES DEL ERROR ===');
        console.log('URL intentada:', `${API_BASE}/buscar/${id}`);
        console.log('Error completo:', error);
    }
}

// ===== ELIMINAR ===== (MANTENIDO IGUAL - NO MODIFICAR)
function eliminarSalon() {
    const id = document.getElementById('id').value.trim();
    const mensaje = document.getElementById('mensaje-eliminar-salon');
    const datos = document.getElementById('datos-salon');

    if (!id) {
        mostrarMensaje(mensaje, 'Ingrese el ID del salón', 'warning');
        return;
    }

    if (!confirm('¿Seguro que desea eliminar este salón?')) return;

    fetch(API_BASE + '/eliminar/' + id, { method: 'DELETE' })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje(mensaje, data.message, 'success');
            datos.style.display = 'none';
            document.getElementById('formulario-eliminar-salon').reset();
        } else {
            mostrarMensaje(mensaje, data.message, 'error');
        }
    })
    .catch(() => {
        mostrarMensaje(mensaje, 'Error de conexión', 'error');
    });
}

// ===== MENSAJES ===== (MEJORADA)
function mostrarMensaje(elemento, texto, tipo) {
    if (!elemento) {
        console.error('Elemento de mensaje no encontrado:', texto);
        return;
    }
    
    elemento.innerHTML = texto;
    elemento.className = `mensaje mensaje-${tipo}`;
    elemento.style.display = 'block';
    
    // Solo ocultar automáticamente si es éxito o error, no si es info
    if (tipo === 'success' || tipo === 'error') {
        setTimeout(() => {
            if (elemento.innerHTML === texto) {
                elemento.style.display = 'none';
            }
        }, 5000);
    }
}