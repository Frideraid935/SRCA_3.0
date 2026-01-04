const API_BASE_CALIFICACIONES = '/api/calificaciones';
const API_BASE_ALUMNOS = '/api/alumnos';
const API_BASE_MATERIAS = '/api/materias';
const API_BASE_PROFESORES = '/api/profesores';

document.addEventListener('DOMContentLoaded', async () => {

    // ELEMENTOS FORMULARIO INGRESAR
    const alumnoIngresar = document.getElementById('alumno_nombre_ingresar');
    const numeroControlIngresar = document.getElementById('numero_de_control_ingresar');
    const materiaIngresar = document.getElementById('materia_id_ingresar');
    const calificacionIngresar = document.getElementById('calificacion_ingresar');
    const profesorIngresar = document.getElementById('profesor_nombre_ingresar');
    const mensajeIngresar = document.getElementById('mensaje-ingresar');
    const formIngresar = document.getElementById('formulario-ingresar');

    // ELEMENTOS FORMULARIO ACTUALIZAR
    const alumnoActualizar = document.getElementById('alumno_nombre_actualizar');
    const materiaActualizar = document.getElementById('materia_id_actualizar');
    const numeroControlActualizar = document.getElementById('numero_de_control_actualizar');
    const calificacionActualizar = document.getElementById('calificacion_actualizar');
    const profesorActualizar = document.getElementById('profesor_nombre_actualizar');
    const mensajeActualizar = document.getElementById('mensaje-actualizar');
    const formularioActualizar = document.getElementById('formulario-actualizar');
    const btnBuscarActualizar = document.getElementById('btn-buscar-actualizar');
    const btnActualizar = document.getElementById('btn-actualizar');

    let calificacionId = null;

    // ========================
    // CARGAR ALUMNOS, MATERIAS Y PROFESORES PARA SELECTS (Opcional, se puede dejar vacío si es manual)
    // ========================
    try {
        const [alumnos, materias, profesores] = await Promise.all([
            fetch(`${API_BASE_ALUMNOS}/listar`).then(res => res.json()),
            fetch(`${API_BASE_MATERIAS}/listar`).then(res => res.json()),
            fetch(`${API_BASE_PROFESORES}/listar`).then(res => res.json())
        ]);

        llenarSelect(alumnoIngresar, alumnos, 'nombre', 'nombre');
        llenarSelect(materiaIngresar, materias, 'nombre', 'nombre');
        llenarSelect(profesorIngresar, profesores, 'nombre', 'nombre');

        llenarSelect(alumnoActualizar, alumnos, 'nombre', 'nombre');
        llenarSelect(materiaActualizar, materias, 'nombre', 'nombre');
        llenarSelect(profesorActualizar, profesores, 'nombre', 'nombre');

    } catch (err) {
        console.error('Error al cargar datos para selects:', err);
    }

    function llenarSelect(select, datos, valor, texto) {
        select.innerHTML = '<option value="">--Escriba o seleccione--</option>';
        datos.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item[valor];
            opt.textContent = item[texto];
            select.appendChild(opt);
        });
    }

    // ========================
    // REGISTRAR CALIFICACIÓN
    // ========================
    if (formIngresar) {
        formIngresar.addEventListener('submit', async (e) => {
            e.preventDefault();
            mensajeIngresar.textContent = '';

            const payload = {
                alumno_nombre: alumnoIngresar.value.trim(),
                numero_de_control: numeroControlIngresar.value.trim(),
                materia_nombre: materiaIngresar.value.trim(),
                calificacion: calificacionIngresar.value.trim(),
                profesor_nombre: profesorIngresar.value.trim()
            };

            try {
                const resp = await fetch(`${API_BASE_CALIFICACIONES}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json();
                mensajeIngresar.textContent = data.message || 'Error desconocido';

                if (resp.ok) {
                    formIngresar.reset();
                }

            } catch (err) {
                console.error(err);
                mensajeIngresar.textContent = 'Error al registrar calificación';
            }
        });
    }

    // ========================
    // BUSCAR CALIFICACIÓN PARA ACTUALIZAR
    // ========================
    if (btnBuscarActualizar) {
        btnBuscarActualizar.addEventListener('click', async (e) => {
            e.preventDefault();
            mensajeActualizar.textContent = '';
            formularioActualizar.style.display = 'none';
            calificacionId = null;

            const alumnoNombre = alumnoActualizar.value.trim();
            const materiaNombre = materiaActualizar.value.trim();

            if (!alumnoNombre || !materiaNombre) {
                mensajeActualizar.textContent = 'Alumno y Materia son requeridos para buscar';
                return;
            }

            try {
                const resp = await fetch(`${API_BASE_CALIFICACIONES}/buscar?alumno_nombre=${encodeURIComponent(alumnoNombre)}&materia_nombre=${encodeURIComponent(materiaNombre)}`);
                if (!resp.ok) {
                    const error = await resp.json();
                    mensajeActualizar.textContent = error.message;
                    return;
                }

                const data = await resp.json();
                calificacionId = data.id;

                numeroControlActualizar.value = data.numero_de_control;
                calificacionActualizar.value = data.calificacion;
                profesorActualizar.value = data.nombre_profesor;

                formularioActualizar.style.display = 'block';

            } catch (err) {
                console.error(err);
                mensajeActualizar.textContent = 'Error al buscar calificación';
            }
        });
    }

    // ========================
    // ACTUALIZAR CALIFICACIÓN
    // ========================
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            if (!calificacionId) {
                mensajeActualizar.textContent = 'Primero busque una calificación para actualizar';
                return;
            }

            const payload = {
                alumno_nombre: alumnoActualizar.value.trim(),
                numero_de_control: numeroControlActualizar.value.trim(),
                materia_nombre: materiaActualizar.value.trim(),
                calificacion: calificacionActualizar.value.trim(),
                profesor_nombre: profesorActualizar.value.trim()
            };

            try {
                const resp = await fetch(`${API_BASE_CALIFICACIONES}/actualizar/${calificacionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json();
                mensajeActualizar.textContent = data.message || 'Error desconocido';

            } catch (err) {
                console.error(err);
                mensajeActualizar.textContent = 'Error al actualizar calificación';
            }
        });
    }

});
