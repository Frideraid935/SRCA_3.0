// calificaciones.js

const API_BASE = '/api/calificaciones';

document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    const formRegistrar = document.getElementById('formulario-ingresarP');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obtenemos datos del formulario
            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_ingresar').value.trim(),
                numero_de_control: document.getElementById('numero_de_control_ingresar').value.trim(),
                materia_id: Number(document.getElementById('materia_id_ingresar').value),
                calificacion: Number(document.getElementById('calificacion_ingresar').value),
                profesor_id: document.getElementById('profesor_nombre_ingresar').value.trim() // Debe ser numero de control del profesor
            };

            // Enviamos al backend
            enviar(`${API_BASE}/registrar`, 'POST', datos, 'mensaje-ingresar');
        });
    }

    /* =========================
       ACTUALIZAR CALIFICACIÓN
    ========================== */
    const btnBuscarActualizar = document.getElementById('btn-buscar-actualizar');
    if (btnBuscarActualizar) {
        btnBuscarActualizar.addEventListener('click', async () => {
            const id = document.getElementById('id_actualizar').value;
            if (!id) {
                alert('Ingrese el ID de la calificación');
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    mostrarMensaje('Calificación no encontrada', 'mensaje-actualizar', false);
                    return;
                }

                // Mostrar formulario con los datos
                document.getElementById('formulario-actualizar').style.display = 'block';
                document.getElementById('alumno_nombre_actualizar').value = data.alumno_nombre;
                document.getElementById('numero_de_control_actualizar').value = data.numero_de_control;
                document.getElementById('materia_id_actualizar').value = data.materia_id;
                document.getElementById('calificacion_actualizar').value = data.calificacion;
                document.getElementById('profesor_nombre_actualizar').value = data.profesor_id;

            } catch (error) {
                mostrarMensaje('Error de conexión', 'mensaje-actualizar', false);
            }
        });
    }

    const btnActualizar = document.getElementById('btn-actualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            const id = document.getElementById('id_actualizar').value;
            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_actualizar').value.trim(),
                numero_de_control: document.getElementById('numero_de_control_actualizar').value.trim(),
                materia_id: Number(document.getElementById('materia_id_actualizar').value),
                calificacion: Number(document.getElementById('calificacion_actualizar').value),
                profesor_id: document.getElementById('profesor_nombre_actualizar').value.trim()
            };

            enviar(`${API_BASE}/actualizar/${id}`, 'PUT', datos, 'mensaje-actualizar');
        });
    }
});

/* =========================
   FUNCION GENERAL FETCH
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
        mostrarMensaje(data.message, idMensaje, res.ok);

    } catch (error) {
        mostrarMensaje('Error de conexión con el servidor', idMensaje, false);
    }
}

/* =========================
   FUNCION PARA MOSTRAR MENSAJES
========================= */
function mostrarMensaje(texto, idMensaje, exito) {
    const mensaje = document.getElementById(idMensaje);
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`;
    mensaje.style.display = 'block';
}
