const API_BASE = '/api/calificaciones';
const API_ALUMNOS = '/api/alumnos/listar';
const API_MATERIAS = '/api/materias/listar';
const API_PROFESORES = '/api/profesores/listar';

document.addEventListener('DOMContentLoaded', async () => {

    // ==============================
    // CARGAR ALUMNOS, MATERIAS Y PROFESORES EN SELECTS
    // ==============================
    const alumnos = await fetch(API_ALUMNOS).then(res => res.json());
    const materias = await fetch(API_MATERIAS).then(res => res.json());
    const profesores = await fetch(API_PROFESORES).then(res => res.json());

    // Llenar selects de registro y actualización
    llenarSelect('alumno_nombre_ingresar', alumnos, 'numero_de_control', 'nombre');
    llenarSelect('alumno_nombre_actualizar', alumnos, 'numero_de_control', 'nombre');
    llenarSelect('materia_id_ingresar', materias, 'id', 'nombre');
    llenarSelect('materia_id_actualizar', materias, 'id', 'nombre');
    llenarSelect('profesor_nombre_ingresar', profesores, 'numero_de_control', 'nombre');
    llenarSelect('profesor_nombre_actualizar', profesores, 'numero_de_control', 'nombre');

    function llenarSelect(idSelect, datos, valor, texto) {
        const select = document.getElementById(idSelect);
        select.innerHTML = '<option value="">--Seleccione--</option>';
        datos.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item[valor];
            opt.textContent = item[texto];
            select.appendChild(opt);
        });
    }

    // ==============================
    // REGISTRAR CALIFICACIÓN
    // ==============================
    document.getElementById('formulario-ingresarP')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const datos = {
            alumno_nombre: document.getElementById('alumno_nombre_ingresar').selectedOptions[0].text,
            numero_de_control: document.getElementById('alumno_nombre_ingresar').value,
            materia_id: parseInt(document.getElementById('materia_id_ingresar').value),
            calificacion: parseFloat(document.getElementById('calificacion_ingresar').value),
            profesor_id: document.getElementById('profesor_nombre_ingresar').value
        };

        await enviar('/api/calificaciones/registrar', 'POST', datos, 'mensaje-ingresar');
    });

    // ==============================
    // BUSCAR CALIFICACIÓN POR ID
    // ==============================
    document.getElementById('btn-buscar-actualizar')?.addEventListener('click', async () => {
        const id = document.getElementById('id_actualizar').value;
        if (!id) return alert('Ingrese ID de calificación');

        const res = await fetch(`${API_BASE}/${id}`);
        const data = await res.json();

        if (!res.ok) return mostrarMensaje('mensaje-actualizar', data.message, false);

        // Llenar formulario
        document.getElementById('formulario-actualizar').style.display = 'block';
        document.getElementById('alumno_nombre_actualizar').value = data.numero_de_control;
        document.getElementById('numero_de_control_actualizar').value = data.numero_de_control;
        document.getElementById('materia_id_actualizar').value = data.materia_id;
        document.getElementById('calificacion_actualizar').value = data.calificacion;
        document.getElementById('profesor_nombre_actualizar').value = data.profesor_id;
    });

    // ==============================
    // ACTUALIZAR CALIFICACIÓN
    // ==============================
    document.getElementById('btn-actualizar')?.addEventListener('click', async () => {
        const id = document.getElementById('id_actualizar').value;

        const datos = {
            alumno_nombre: document.getElementById('alumno_nombre_actualizar').selectedOptions[0].text,
            numero_de_control: document.getElementById('numero_de_control_actualizar').value,
            materia_id: parseInt(document.getElementById('materia_id_actualizar').value),
            calificacion: parseFloat(document.getElementById('calificacion_actualizar').value),
            profesor_id: document.getElementById('profesor_nombre_actualizar').value
        };

        await enviar(`${API_BASE}/actualizar/${id}`, 'PUT', datos, 'mensaje-actualizar');
    });
});

// ==============================
// FUNCIONES AUXILIARES
// ==============================
async function enviar(url, metodo, datos, idMensaje) {
    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const data = await res.json();
        mostrarMensaje(idMensaje, data.message, res.ok);
    } catch (err) {
        mostrarMensaje(idMensaje, 'Error de conexión con el servidor', false);
    }
}

function mostrarMensaje(idMensaje, texto, exito) {
    const mensaje = document.getElementById(idMensaje);
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`;
    mensaje.style.display = 'block';
}
