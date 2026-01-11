const API_BASE = '/api/salones';
const TIMEOUT = 30000;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de salones cargado');

    const formRegistrar = document.getElementById('formulario-salon');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', e => {
            e.preventDefault();
            registrarSalon();
        });
    }

    const formBuscar = document.getElementById('formulario-buscar-salon');
    if (formBuscar) {
        formBuscar.addEventListener('submit', e => {
            e.preventDefault();
            buscarSalon();
        });
    }

    const formEliminar = document.getElementById('formulario-eliminar-salon');
    if (formEliminar) {
        formEliminar.addEventListener('submit', e => {
            e.preventDefault();
            eliminarSalon();
        });
    }
});

/* ================= REGISTRAR ================= */
function registrarSalon() {
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

/* ================= BUSCAR ================= */
document.addEventListener('DOMContentLoaded', () => {

    // ===== BUSCAR SALÓN =====
    const btnBuscar = document.getElementById('btn-buscar-salon');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', async () => {
            const nombre = document.getElementById('buscar-nombre').value.trim();
            const mensaje = document.getElementById('mensaje-busqueda-salon');
            const datos = document.getElementById('datos-salon');

            // Limpiar mensajes previos
            mensaje.style.display = 'none';
            datos.style.display = 'none';
            datos.innerHTML = '';

            if (!nombre) {
                mensaje.textContent = 'Debe escribir el nombre del salón';
                mensaje.className = 'mensaje mensaje-error';
                mensaje.style.display = 'block';
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/buscar/${encodeURIComponent(nombre)}`);
                const data = await res.json();

                if (!data.success) {
                    mensaje.textContent = data.message;
                    mensaje.className = 'mensaje mensaje-error';
                    mensaje.style.display = 'block';
                    return;
                }

                const salon = data.salon;

                datos.innerHTML = `
                    <p><strong>ID:</strong> ${salon.id}</p>
                    <p><strong>Nombre:</strong> ${salon.nombre}</p>
                    <p><strong>Capacidad:</strong> ${salon.capacidad}</p>
                    <p><strong>Profesor (No. Control):</strong> ${salon.profesor_id}</p>
                `;
                datos.style.display = 'block';

            } catch (err) {
                mensaje.textContent = 'Error de conexión con el servidor';
                mensaje.className = 'mensaje mensaje-error';
                mensaje.style.display = 'block';
                console.error(err);
            }
        });
    }

    // Registrar y eliminar siguen intactos
});


/* ================= ELIMINAR ================= */
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

/* ================= MENSAJES ================= */
function mostrarMensaje(el, texto, tipo) {
    el.innerHTML = texto;
    el.className = 'mensaje mensaje-' + tipo;
    el.style.display = 'block';

    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}
