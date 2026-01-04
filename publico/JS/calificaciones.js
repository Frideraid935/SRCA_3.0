const API_BASE_ALUMNOS = '/api/alumnos';
const API_BASE_MATERIAS = '/api/materias';
const API_BASE_PROFESORES = '/api/profesores';
const API_BASE_CALIFICACIONES = '/api/calificaciones';

document.addEventListener('DOMContentLoaded', async () => {

    /* =========================
       CARGAR DATOS EN SELECTS
    ========================== */
    async function cargarSelects() {
        try {
            const [alumnos, materias, profesores] = await Promise.all([
                fetch(`${API_BASE_ALUMNOS}/listar`).then(r => r.json()),
                fetch(`${API_BASE_MATERIAS}/listar`).then(r => r.json()),
                fetch(`${API_BASE_PROFESORES}/listar`).then(r => r.json())
            ]);

            llenarSelect('alumno_nombre_ingresar', alumnos, 'nombre', 'nombre');
            llenarSelect('materia_id_ingresar', materias, 'nombre', 'nombre');
            llenarSelect('profesor_nombre_ingresar', profesores, 'nombre', 'nombre');

            llenarSelect('alumno_nombre_actualizar', alumnos, 'nombre', 'nombre');
            llenarSelect('materia_id_actualizar', materias, 'nombre', 'nombre');
            llenarSelect('profesor_nombre_actualizar', profesores, 'nombre', 'nombre');
        } catch (err) {
            console.error('Error al cargar datos de selects:', err);
        }
    }

    function llenarSelect(id, datos, valor, texto) {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">--Seleccione--</option>';
        datos.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item[valor];
            opt.textContent = item[texto];
            select.appendChild(opt);
        });
    }

    await cargarSelects();

    /* =========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    const formRegistrar = document.getElementById('formulario-ingresarP');
    const mensajeRegistrar = document.getElementById('mensaje-ingresar');

    formRegistrar?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_ingresar').value,
            numero_de_control: document.getElementById('numero_de_control_ingresar').value,
            materia_nombre: document.getElementById('materia_id_ingresar').value,
            calificacion: document.getElementById('calificacion_ingresar').value,
            profesor_nombre: document.getElementById('profesor_nombre_ingresar').value
        };

        try {
            const res = await fetch(`${API_BASE_CALIFICACIONES}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            mensajeRegistrar.textContent = result.message;
            mensajeRegistrar.style.color = res.ok ? 'green' : 'red';
        } catch (err) {
            console.error(err);
            mensajeRegistrar.textContent = 'Error al conectar con el servidor';
            mensajeRegistrar.style.color = 'red';
        }
    });

    /* =========================
       BUSCAR CALIFICACIÓN PARA ACTUALIZAR
    ========================== */
    const btnBuscar = document.getElementById('btn-buscar-actualizar');
    const formActualizar = document.getElementById('formulario-actualizar');
    const mensajeActualizar = document.getElementById('mensaje-actualizar');

    btnBuscar?.addEventListener('click', async () => {
        const alumno = document.getElementById('alumno_nombre_actualizar').value;
        const materia = document.getElementById('materia_id_actualizar').value;

        if (!alumno || !materia) {
            mensajeActualizar.textContent = 'Alumno y materia son requeridos para buscar';
            mensajeActualizar.style.color = 'red';
            return;
        }

        try {
            const res = await fetch(`${API_BASE_CALIFICACIONES}/buscar?alumno_nombre=${encodeURIComponent(alumno)}&materia_nombre=${encodeURIComponent(materia)}`);
            const result = await res.json();

            if (res.status !== 200) {
                mensajeActualizar.textContent = result.message;
                mensajeActualizar.style.color = 'red';
                formActualizar.style.display = 'none';
                return;
            }

            formActualizar.style.display = 'block';
            mensajeActualizar.textContent = '';

            document.getElementById('id_actualizar').value = result.id;
            document.getElementById('alumno_nombre_actualizar').value = result.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = result.numero_de_control;
            document.getElementById('materia_id_actualizar').value = result.nombre_materia;
            document.getElementById('calificacion_actualizar').value = result.calificacion;
            document.getElementById('profesor_nombre_actualizar').value = result.nombre_profesor;

        } catch (err) {
            console.error(err);
            mensajeActualizar.textContent = 'Error al conectar con el servidor';
            mensajeActualizar.style.color = 'red';
            formActualizar.style.display = 'none';
        }
    });

    /* =========================
       ACTUALIZAR CALIFICACIÓN
    ========================== */
    const btnActualizar = document.getElementById('btn-actualizar');
    btnActualizar?.addEventListener('click', async () => {
        const id = document.getElementById('id_actualizar').value;
        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_actualizar').value,
            numero_de_control: document.getElementById('numero_de_control_actualizar').value,
            materia_nombre: document.getElementById('materia_id_actualizar').value,
            calificacion: document.getElementById('calificacion_actualizar').value,
            profesor_nombre: document.getElementById('profesor_nombre_actualizar').value
        };

        try {
            const res = await fetch(`${API_BASE_CALIFICACIONES}/actualizar/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            mensajeActualizar.textContent = result.message;
            mensajeActualizar.style.color = res.ok ? 'green' : 'red';
        } catch (err) {
            console.error(err);
            mensajeActualizar.textContent = 'Error al conectar con el servidor';
            mensajeActualizar.style.color = 'red';
        }
    });

});
