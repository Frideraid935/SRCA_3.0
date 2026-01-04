document.addEventListener('DOMContentLoaded', () => {

    const API_ALUMNOS = '/api/alumnos';
    const API_MATERIAS = '/api/materias';
    const API_PROFESORES = '/api/profesores';
    const API_CALIFICACIONES = '/api/calificaciones';

    /* ==========================
       REGISTRAR CALIFICACIÓN
    ========================== */
    const formRegistrar = document.getElementById('formulario-ingresar');
    const msgRegistrar = document.getElementById('mensaje-ingresar');

    formRegistrar?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_ingresar').value.trim(),
            numero_de_control: document.getElementById('numero_de_control_ingresar').value.trim(),
            materia_nombre: document.getElementById('materia_nombre_ingresar').value.trim(),
            calificacion: document.getElementById('calificacion_ingresar').value.trim(),
            profesor_nombre: document.getElementById('profesor_nombre_ingresar').value.trim()
        };

        try {
            const res = await fetch(`${API_CALIFICACIONES}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            msgRegistrar.textContent = json.message;
            msgRegistrar.style.color = json.success ? 'green' : 'red';
            if (json.success) formRegistrar.reset();
        } catch (err) {
            msgRegistrar.textContent = 'Error al registrar calificación';
            msgRegistrar.style.color = 'red';
            console.error(err);
        }
    });

    /* ==========================
       ACTUALIZAR CALIFICACIÓN
    ========================== */
    const btnBuscar = document.getElementById('btn-buscar-actualizar');
    const formActualizar = document.getElementById('formulario-actualizar');
    const msgActualizar = document.getElementById('mensaje-actualizar');

    btnBuscar?.addEventListener('click', async () => {
        const alumno = document.getElementById('alumno_nombre_actualizar_buscar').value.trim();
        const materia = document.getElementById('materia_nombre_actualizar_buscar').value.trim();

        if (!alumno || !materia) {
            msgActualizar.textContent = 'Alumno y Materia son requeridos para buscar';
            msgActualizar.style.color = 'red';
            return;
        }

        try {
            const res = await fetch(`${API_CALIFICACIONES}/buscar?alumno=${encodeURIComponent(alumno)}&materia=${encodeURIComponent(materia)}`);
            const json = await res.json();

            if (!json.success) {
                msgActualizar.textContent = json.message;
                msgActualizar.style.color = 'red';
                formActualizar.style.display = 'none';
                return;
            }

            // Llenar campos con los datos encontrados
            document.getElementById('alumno_nombre_actualizar').value = json.data.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = json.data.numero_de_control;
            document.getElementById('materia_nombre_actualizar').value = json.data.materia_nombre;
            document.getElementById('calificacion_actualizar').value = json.data.calificacion;
            document.getElementById('profesor_nombre_actualizar').value = json.data.profesor_nombre;
            document.getElementById('calificacion_id_actualizar').value = json.data.id;

            formActualizar.style.display = 'block';
            msgActualizar.textContent = '';
        } catch (err) {
            msgActualizar.textContent = 'Error al buscar calificación';
            msgActualizar.style.color = 'red';
            console.error(err);
        }
    });

    document.getElementById('btn-actualizar')?.addEventListener('click', async () => {
        const id = document.getElementById('calificacion_id_actualizar').value;
        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_actualizar').value.trim(),
            numero_de_control: document.getElementById('numero_de_control_actualizar').value.trim(),
            materia_nombre: document.getElementById('materia_nombre_actualizar').value.trim(),
            calificacion: document.getElementById('calificacion_actualizar').value.trim(),
            profesor_nombre: document.getElementById('profesor_nombre_actualizar').value.trim()
        };

        try {
            const res = await fetch(`${API_CALIFICACIONES}/actualizar/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            msgActualizar.textContent = json.message;
            msgActualizar.style.color = json.success ? 'green' : 'red';
            if (json.success) formActualizar.reset();
        } catch (err) {
            msgActualizar.textContent = 'Error al actualizar calificación';
            msgActualizar.style.color = 'red';
            console.error(err);
        }
    });

});
