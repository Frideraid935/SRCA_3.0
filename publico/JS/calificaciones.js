// URL base de la API
const API_BASE = '/api/calificaciones';
const API_ALUMNOS = '/api/alumnos';
const API_MATERIAS = '/api/materias';
const API_PROFESORES = '/api/profesores';

document.addEventListener('DOMContentLoaded', () => {

    // ==============================
    // Cargar alumnos, materias y profesores en selects
    // ==============================
    cargarSelects();

    async function cargarSelects() {
        // Cargar alumnos
        const resAlumnos = await fetch(API_ALUMNOS + '/listar');
        const alumnos = await resAlumnos.json();
        rellenarSelect('alumno_nombre_ingresar', alumnos, 'numero_de_control', 'nombre');
        rellenarSelect('alumno_nombre_actualizar', alumnos, 'numero_de_control', 'nombre');

        // Cargar materias
        const resMaterias = await fetch(API_MATERIAS + '/listar');
        const materias = await resMaterias.json();
        rellenarSelect('materia_id_ingresar', materias, 'id', 'nombre');
        rellenarSelect('materia_id_actualizar', materias, 'id', 'nombre');

        // Cargar profesores
        const resProfes = await fetch(API_PROFESORES + '/listar');
        const profes = await resProfes.json();
        rellenarSelect('profesor_nombre_ingresar', profes, 'numero_de_control', 'nombre');
        rellenarSelect('profesor_nombre_actualizar', profes, 'numero_de_control', 'nombre');
    }

    function rellenarSelect(selectId, datos, valueKey, textKey) {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">--Seleccione--</option>';
        datos.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item[valueKey];
            opt.textContent = item[textKey];
            select.appendChild(opt);
        });
    }

    // ==============================
    // REGISTRAR CALIFICACIÓN
    // ==============================
    const formRegistrar = document.getElementById('formulario-ingresarP');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_ingresar').selectedOptions[0].text,
                numero_de_control: document.getElementById('alumno_nombre_ingresar').value,
                materia_id: parseInt(document.getElementById('materia_id_ingresar').value),
                calificacion: parseFloat(document.getElementById('calificacion_ingresar').value),
                profesor_id: document.getElementById('profesor_nombre_ingresar').value
            };
            await enviar(`${API_BASE}/registrar`, 'POST', datos, 'mensaje-ingresar');
        });
    }

    // ==============================
    // BUSCAR CALIFICACIÓN POR ID
    // ==============================
    const btnBuscar = document.getElementById('btn-buscar-actualizar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', async () => {
            const id = document.getElementById('id_actualizar').value.trim();
            if (!id) return alert('Ingrese el ID de la calificación');

            try {
                const res = await fetch(`${API_BASE}/${id}`);
                const data = await res.json();
                if (!res.ok) {
                    mostrarMensaje('mensaje-actualizar', data.message || 'No encontrado', false);
                    return;
                }

                // Mostrar formulario y llenar campos
                const formActualizar = document.getElementById('formulario-actualizar');
                formActualizar.style.display = 'block';

                document.getElementById('alumno_nombre_actualizar').value = data.numero_de_control;
                document.getElementById('numero_de_control_actualizar').value = data.numero_de_control;
                document.getElementById('materia_id_actualizar').value = data.materia_id;
                document.getElementById('calificacion_actualizar').value = data.calificacion;
                document.getElementById('profesor_nombre_actualizar').value = data.profesor_id;

            } catch (error) {
                mostrarMensaje('mensaje-actualizar', 'Error de conexión con el servidor', false);
            }
        });
    }

    // ==============================
    // ACTUALIZAR CALIFICACIÓN
    // ==============================
    const btnActualizar = document.getElementById('btn-actualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            const id = document.getElementById('id_actualizar').value.trim();
            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_actualizar').selectedOptions[0].text,
                numero_de_control: document.getElementById('numero_de_control_actualizar').value,
                materia_id: parseInt(document.getElementById('materia_id_actualizar').value),
                calificacion: parseFloat(document.getElementById('calificacion_actualizar').value),
                profesor_id: document.getElementById('profesor_nombre_actualizar').value
            };
            await enviar(`${API_BASE}/actualizar/${id}`, 'PUT', datos, 'mensaje-actualizar');
        });
    }
});

// ==============================
// FUNCIÓN GENERAL PARA ENVIAR PETICIONES
// ==============================
async function enviar(url, metodo, datos, idMensaje) {
    const mensaje = document.getElementById(idMensaje);
    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const data = await res.json();
        mostrarMensaje(idMensaje, data.message, res.ok);
    } catch (error) {
        mostrarMensaje(idMensaje, 'Error de conexión con el servidor', false);
    }
}

// ==============================
// MOSTRAR MENSAJES
// ==============================
function mostrarMensaje(idMensaje, texto, exito) {
    const mensaje = document.getElementById(idMensaje);
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`;
    mensaje.style.display = 'block';
}
