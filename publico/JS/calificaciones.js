// URL base de la API
const API_BASE = '/api/calificaciones';
const API_ALUMNOS = '/api/alumnos';
const API_MATERIAS = '/api/materias';
const API_PROFESORES = '/api/profesores';

document.addEventListener('DOMContentLoaded', () => {
    // Cargar selects dinámicos
    cargarAlumnos();
    cargarMaterias();
    cargarProfesores();

    // =========================
    // REGISTRAR CALIFICACIÓN
    // =========================
    const formRegistrar = document.getElementById('formulario-ingresarP');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', async e => {
            e.preventDefault();

            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_ingresar').value,
                numero_de_control: document.getElementById('numero_de_control_ingresar').value,
                materia_id: parseInt(document.getElementById('materia_id_ingresar').value),
                calificacion: parseFloat(document.getElementById('calificacion_ingresar').value),
                profesor_id: document.getElementById('profesor_nombre_ingresar').value
            };

            await enviar(`${API_BASE}/registrar`, 'POST', datos, 'mensaje-ingresar');
        });
    }

    // =========================
    // BUSCAR Y MOSTRAR PARA ACTUALIZAR
    // =========================
    const btnBuscar = document.getElementById('btn-buscar-actualizar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', async () => {
            const id = document.getElementById('id_actualizar').value;
            if (!id) return alert('Ingrese el ID de la calificación');

            try {
                const res = await fetch(`${API_BASE}/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    mostrarMensaje(data.message, 'mensaje-actualizar', false);
                    return;
                }

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

    // =========================
    // ACTUALIZAR CALIFICACIÓN
    // =========================
    const formActualizar = document.getElementById('formulario-actualizar');
    if (formActualizar) {
        formActualizar.addEventListener('submit', async e => {
            e.preventDefault();

            const id = document.getElementById('id_actualizar').value;

            const datos = {
                alumno_nombre: document.getElementById('alumno_nombre_actualizar').value,
                numero_de_control: document.getElementById('numero_de_control_actualizar').value,
                materia_id: parseInt(document.getElementById('materia_id_actualizar').value),
                calificacion: parseFloat(document.getElementById('calificacion_actualizar').value),
                profesor_id: document.getElementById('profesor_nombre_actualizar').value
            };

            await enviar(`${API_BASE}/actualizar/${id}`, 'PUT', datos, 'mensaje-actualizar');
        });
    }
});

// =========================
// FUNCIONES AUXILIARES
// =========================

// Cargar alumnos
async function cargarAlumnos() {
    const selectReg = document.getElementById('alumno_nombre_ingresar');
    const selectAct = document.getElementById('alumno_nombre_actualizar');
    if (!selectReg && !selectAct) return;

    try {
        const res = await fetch(API_ALUMNOS + '/listar');
        const alumnos = await res.json();

        alumnos.forEach(a => {
            const option = `<option value="${a.nombre}" data-control="${a.numero_de_control}">${a.nombre}</option>`;
            if (selectReg) selectReg.insertAdjacentHTML('beforeend', option);
            if (selectAct) selectAct.insertAdjacentHTML('beforeend', option);
        });

        // Completar número de control automáticamente al seleccionar alumno
        if (selectReg) selectReg.addEventListener('change', e => {
            const idx = e.target.selectedIndex;
            document.getElementById('numero_de_control_ingresar').value = e.target.options[idx].dataset.control;
        });
        if (selectAct) selectAct.addEventListener('change', e => {
            const idx = e.target.selectedIndex;
            document.getElementById('numero_de_control_actualizar').value = e.target.options[idx].dataset.control;
        });

    } catch (error) {
        console.error('Error cargando alumnos:', error);
    }
}

// Cargar materias
async function cargarMaterias() {
    const selectReg = document.getElementById('materia_id_ingresar');
    const selectAct = document.getElementById('materia_id_actualizar');
    if (!selectReg && !selectAct) return;

    try {
        const res = await fetch(API_MATERIAS + '/listar');
        const materias = await res.json();

        materias.forEach(m => {
            const option = `<option value="${m.id}">${m.nombre}</option>`;
            if (selectReg) selectReg.insertAdjacentHTML('beforeend', option);
            if (selectAct) selectAct.insertAdjacentHTML('beforeend', option);
        });
    } catch (error) {
        console.error('Error cargando materias:', error);
    }
}

// Cargar profesores
async function cargarProfesores() {
    const selectReg = document.getElementById('profesor_nombre_ingresar');
    const selectAct = document.getElementById('profesor_nombre_actualizar');
    if (!selectReg && !selectAct) return;

    try {
        const res = await fetch('/api/profesores/listar');
        const profesores = await res.json();

        profesores.forEach(p => {
            const option = `<option value="${p.numero_de_control}">${p.nombre}</option>`;
            if (selectReg) selectReg.insertAdjacentHTML('beforeend', option);
            if (selectAct) selectAct.insertAdjacentHTML('beforeend', option);
        });
    } catch (error) {
        console.error('Error cargando profesores:', error);
    }
}

// Función general para enviar datos a la API
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

// Mostrar mensajes
function mostrarMensaje(texto, idMensaje, exito) {
    const mensaje = document.getElementById(idMensaje);
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${exito ? 'mensaje-exito' : 'mensaje-error'}`;
    mensaje.style.display = 'block';
}
