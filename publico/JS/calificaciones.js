const API_BASE = '/api/calificaciones';

document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    const formRegistrar = document.getElementById('formulario-ingresarP');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_ingresar').value.trim(),
                numero_de_control: document.getElementById('numero_de_control_ingresar').value.trim(),
                materia_id: document.getElementById('materia_id_ingresar').value,
                calificacion: document.getElementById('calificacion_ingresar').value,
                profesor_id: document.getElementById('profesor_nombre_ingresar').value.trim()
            };

            await enviar(`${API_BASE}/registrar`, 'POST', datos, 'mensaje-ingresar');
        });
    }

    /* =========================
       BUSCAR POR ID PARA ACTUALIZAR
    ========================== */
    const btnBuscar = document.getElementById('btn-buscar-actualizar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', async (e) => {
            e.preventDefault();

            const id = document.getElementById('id_actualizar').value.trim();
            if (!id) {
                mostrarMensaje('Ingrese el ID de la calificación', false, 'mensaje-actualizar');
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    mostrarMensaje(data.message || 'No encontrado', false, 'mensaje-actualizar');
                    return;
                }

                // Mostrar el formulario de actualización
                const formActualizar = document.getElementById('formulario-actualizar');
                formActualizar.style.display = 'block';

                // Rellenar campos con los datos obtenidos
                document.getElementById('alumno_nombre_actualizar').value = data.alumno_nombre;
                document.getElementById('numero_de_control_actualizar').value = data.numero_de_control;
                document.getElementById('materia_id_actualizar').value = data.materia_id;
                document.getElementById('calificacion_actualizar').value = data.calificacion;
                document.getElementById('profesor_nombre_actualizar').value = data.profesor_id; // profesor_id de tu tabla

            } catch (error) {
                mostrarMensaje('Error de conexión con el servidor', false, 'mensaje-actualizar');
            }
        });
    }

    /* =========================
       ACTUALIZAR CALIFICACIÓN
    ========================== */
    const btnActualizar = document.getElementById('btn-actualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            const id = document.getElementById('id_actualizar').value.trim();
            if (!id) {
                mostrarMensaje('Ingrese el ID de la calificación', false, 'mensaje-actualizar');
                return;
            }

            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_actualizar').value.trim(),
                numero_de_control: document.getElementById('numero_de_control_actualizar').value.trim(),
                materia_id: document.getElementById('materia_id_actualizar').value,
                calificacion: document.getElementById('calificacion_actualizar').value
            };

            await enviar(`${API_BASE}/actualizar/${id}`, 'PUT', datos, 'mensaje-actualizar');
        });
    }
});

/* =========================
   FUNCIÓN FETCH GENERAL
========================= */
async function enviar(url, metodo, datos, idMensaje) {
    const mensaje = document.getElementById(idMensaje);

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await res.json();
        mostrarMensaje(data.message, res.ok, idMensaje);

    } catch (error) {
        mostrarMensaje('Error de conexión con el servidor', false, idMensaje);
    }
}

/* =========================
   MENSAJES
========================= */
function mostrarMensaje(texto, exito, idMensaje) {
    const mensaje = document.getElementById(idMensaje);
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`;
    mensaje.style.display = 'block';
}
