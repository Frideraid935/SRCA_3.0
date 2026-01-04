const API_BASE = '/api/calificaciones';

document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    const formRegistrar = document.getElementById('form-registrar-calificacion');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datos = {
                alumno_nombre: document.getElementById('alumno').value.trim(),
                numero_de_control: document.getElementById('control').value.trim(),
                materia_id: document.getElementById('materia').value,
                calificacion: document.getElementById('calificacion').value,
                profesor_id: document.getElementById('profesor').value.trim()
            };

            enviar(`${API_BASE}/registrar`, 'POST', datos);
        });
    }

    /* =========================
       BUSCAR POR ID
    ========================== */
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', async () => {
            const id = document.getElementById('id_calificacion').value;
            if (!id) {
                alert('Ingrese el ID de la calificación');
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    mostrarMensaje(data.message || 'No encontrado', false);
                    return;
                }

                document.getElementById('form-actualizar-calificacion').style.display = 'block';

                document.getElementById('alumno').value = data.alumno_nombre;
                document.getElementById('control').value = data.numero_de_control;
                document.getElementById('materia').value = data.materia_id;
                document.getElementById('calificacion').value = data.calificacion;
                document.getElementById('profesor').value = data.profesor_nombre || '';

            } catch (error) {
                mostrarMensaje('Error de conexión', false);
            }
        });
    }

    /* =========================
       ACTUALIZAR CALIFICACIÓN
    ========================== */
    const formActualizar = document.getElementById('form-actualizar-calificacion');
    if (formActualizar) {
        formActualizar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('id_calificacion').value;

            const datos = {
                alumno_nombre: document.getElementById('alumno').value.trim(),
                numero_de_control: document.getElementById('control').value.trim(),
                materia_id: document.getElementById('materia').value,
                calificacion: document.getElementById('calificacion').value
            };

            enviar(`${API_BASE}/actualizar/${id}`, 'PUT', datos);
        });
    }
});

/* =========================
   FUNCIÓN FETCH GENERAL
========================= */
async function enviar(url, metodo, datos) {
    const mensaje = document.getElementById('mensaje');

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await res.json();
        mostrarMensaje(data.message, res.ok);

    } catch (error) {
        mostrarMensaje('Error de conexión con el servidor', false);
    }
}

/* =========================
   MENSAJES
========================= */
function mostrarMensaje(texto, exito) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`;
    mensaje.style.display = 'block';
}
