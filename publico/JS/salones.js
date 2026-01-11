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
// ===============================
// BUSCAR SALÓN
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    const formBuscar = document.getElementById('formulario-buscar-salon');

    if (!formBuscar) return;

    formBuscar.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombreInput = document.getElementById('nombre');
        const mensaje = document.getElementById('mensaje-busqueda-salon');
        const datos = document.getElementById('datos-salon');

        const nombre = nombreInput.value.trim();

        mensaje.style.display = 'none';
        datos.style.display = 'none';

        if (!nombre) {
            mensaje.textContent = 'Ingrese el nombre del salón';
            mensaje.className = 'mensaje mensaje-error';
            mensaje.style.display = 'block';
            return;
        }

        fetch('/api/salones/buscar/' + encodeURIComponent(nombre))
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    mensaje.textContent = data.message;
                    mensaje.className = 'mensaje mensaje-error';
                    mensaje.style.display = 'block';
                    return;
                }

                const s = data.salon;

                datos.innerHTML = `
                    <p><strong>ID:</strong> ${s.id}</p>
                    <p><strong>Nombre:</strong> ${s.nombre}</p>
                    <p><strong>Capacidad:</strong> ${s.capacidad}</p>
                    <p><strong>Profesor:</strong> ${s.profesor_id}</p>
                `;
                datos.style.display = 'block';
            })
            .catch(() => {
                mensaje.textContent = 'Error de conexión con el servidor';
                mensaje.className = 'mensaje mensaje-error';
                mensaje.style.display = 'block';
            });
    });
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
