// ================================
// Archivo JS para manejar calificaciones
// Funciona para registrar y actualizar calificaciones
// Compatible con backend en Railway
// ================================

// URL base de la API de calificaciones
const API_BASE = '/api/calificaciones';

document.addEventListener('DOMContentLoaded', () => {

    /* ================================
       REGISTRAR CALIFICACIÓN
    ================================= */
    const formRegistrar = document.getElementById('formulario-ingresarP');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita recargar la página al enviar

            // Tomamos los valores de los inputs
            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_ingresar').value.trim(),
                numero_de_control: document.getElementById('numero_de_control_ingresar').value.trim(),
                materia_id: document.getElementById('materia_id_ingresar').value,
                calificacion: document.getElementById('calificacion_ingresar').value,
                profesor_id: document.getElementById('profesor_nombre_ingresar').value.trim()
            };

            // Llamada a la función general para enviar los datos
            await enviar(`${API_BASE}/registrar`, 'POST', datos, 'mensaje-ingresar');
        });
    }

    /* ================================
       BUSCAR CALIFICACIÓN POR ID (para actualizar)
    ================================= */
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
                // Hacemos la solicitud GET al servidor
                const res = await fetch(`${API_BASE}/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    mostrarMensaje(data.message || 'Calificación no encontrada', false, 'mensaje-actualizar');
                    return;
                }

                // Mostramos el formulario de actualización
                const formActualizar = document.getElementById('formulario-actualizar');
                formActualizar.style.display = 'block';

                // Llenamos los campos con los datos obtenidos
                document.getElementById('alumno_nombre_actualizar').value = data.alumno_nombre;
                document.getElementById('numero_de_control_actualizar').value = data.numero_de_control;
                document.getElementById('materia_id_actualizar').value = data.materia_id;
                document.getElementById('calificacion_actualizar').value = data.calificacion;
                document.getElementById('profesor_nombre_actualizar').value = data.profesor_id;

            } catch (error) {
                mostrarMensaje('Error de conexión con el servidor', false, 'mensaje-actualizar');
            }
        });
    }

    /* ================================
       ACTUALIZAR CALIFICACIÓN
    ================================= */
    const btnActualizar = document.getElementById('btn-actualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            const id = document.getElementById('id_actualizar').value.trim();
            if (!id) {
                mostrarMensaje('Ingrese el ID de la calificación', false, 'mensaje-actualizar');
                return;
            }

            // Tomamos los valores del formulario de actualización
            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_actualizar').value.trim(),
                numero_de_control: document.getElementById('numero_de_control_actualizar').value.trim(),
                materia_id: document.getElementById('materia_id_actualizar').value,
                calificacion: document.getElementById('calificacion_actualizar').value
            };

            // Enviamos datos al servidor usando PUT
            await enviar(`${API_BASE}/actualizar/${id}`, 'PUT', datos, 'mensaje-actualizar');
        });
    }
});

/* ================================
   FUNCIÓN GENERAL PARA HACER FETCH
   Recibe: url, método, datos y id del div de mensaje
================================ */
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

/* ================================
   FUNCIÓN PARA MOSTRAR MENSAJES
   Recibe: texto, exito (true/false), id del div de mensaje
================================ */
function mostrarMensaje(texto, exito, idMensaje) {
    const mensaje = document.getElementById(idMensaje);
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`;
    mensaje.style.display = 'block';
}
