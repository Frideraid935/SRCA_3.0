document.addEventListener('DOMContentLoaded', () => {

    const API_ALUMNOS = '/api/alumnos/listar';
    const API_MATERIAS = '/api/materias/listar';
    const API_PROFESORES = '/api/profesores/listar';
    const API_CALIFICACIONES = '/api/calificaciones';

    let alumnos = [];
    let materias = [];
    let profesores = [];

    // Cargar datos para validar
    async function cargarDatos() {
        try {
            [alumnos, materias, profesores] = await Promise.all([
                fetch(API_ALUMNOS).then(res => res.json()),
                fetch(API_MATERIAS).then(res => res.json()),
                fetch(API_PROFESORES).then(res => res.json())
            ]);
        } catch (err) {
            console.error('Error al cargar datos:', err);
        }
    }

    cargarDatos();

    // ======= REGISTRAR CALIFICACIÓN =======
    const formIngresar = document.getElementById('formulario-ingresar');
    const mensajeIngresar = document.getElementById('mensaje-ingresar');

    formIngresar.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensajeIngresar.textContent = '';

        const alumno_nombre = document.getElementById('alumno_nombre_ingresar').value.trim();
        const numero_de_control = document.getElementById('numero_de_control_ingresar').value.trim();
        const materia_nombre = document.getElementById('materia_nombre_ingresar').value.trim();
        const calificacion = document.getElementById('calificacion_ingresar').value.trim();
        const profesor_nombre = document.getElementById('profesor_nombre_ingresar').value.trim();

        // Validaciones con APIs
        const alumno = alumnos.find(a => a.nombre.toLowerCase() === alumno_nombre.toLowerCase());
        if (!alumno) return mensajeIngresar.textContent = 'Alumno no encontrado';
        const materia = materias.find(m => m.nombre.toLowerCase() === materia_nombre.toLowerCase());
        if (!materia) return mensajeIngresar.textContent = 'Materia no encontrada';
        const profesor = profesores.find(p => p.nombre.toLowerCase() === profesor_nombre.toLowerCase());
        if (!profesor) return mensajeIngresar.textContent = 'Profesor no encontrado';

        try {
            const resp = await fetch(`${API_CALIFICACIONES}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alumno_nombre,
                    numero_de_control: alumno.numero_de_control,
                    materia_id: materia.id,
                    calificacion,
                    profesor_id: profesor.numero_de_control
                })
            }).then(r => r.json());

            mensajeIngresar.textContent = resp.message || 'Calificación registrada correctamente';
            if (resp.success !== false) formIngresar.reset();

        } catch (err) {
            mensajeIngresar.textContent = 'Error al registrar calificación';
            console.error(err);
        }
    });

    // ======= BUSCAR Y ACTUALIZAR CALIFICACIÓN =======
    const formBuscar = document.getElementById('formulario-buscar-actualizar');
    const formActualizar = document.getElementById('formulario-actualizar');
    const mensajeBuscar = document.getElementById('mensaje-buscar');
    const mensajeActualizar = document.getElementById('mensaje-actualizar');

    formBuscar.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensajeBuscar.textContent = '';
        formActualizar.style.display = 'none';

        const alumno_nombre = document.getElementById('alumno_nombre_buscar').value.trim();
        const materia_nombre = document.getElementById('materia_nombre_buscar').value.trim();

        try {
            const calificaciones = await fetch(`${API_CALIFICACIONES}/listar`).then(r => r.json());
            const cal = calificaciones.find(c => 
                c.alumno_nombre.toLowerCase() === alumno_nombre.toLowerCase() &&
                c.nombre_materia.toLowerCase() === materia_nombre.toLowerCase()
            );

            if (!cal) return mensajeBuscar.textContent = 'Calificación no encontrada';

            // Mostrar formulario con datos
            formActualizar.style.display = 'block';
            document.getElementById('alumno_nombre_actualizar').value = cal.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = cal.numero_de_control;
            document.getElementById('materia_nombre_actualizar').value = cal.nombre_materia;
            document.getElementById('calificacion_actualizar').value = cal.calificacion;
            document.getElementById('profesor_nombre_actualizar').value = cal.nombre_profesor;

        } catch (err) {
            mensajeBuscar.textContent = 'Error al buscar calificación';
            console.error(err);
        }
    });

    formActualizar.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensajeActualizar.textContent = '';

        const alumno_nombre = document.getElementById('alumno_nombre_actualizar').value.trim();
        const numero_de_control = document.getElementById('numero_de_control_actualizar').value.trim();
        const materia_nombre = document.getElementById('materia_nombre_actualizar').value.trim();
        const calificacion = document.getElementById('calificacion_actualizar').value.trim();
        const profesor_nombre = document.getElementById('profesor_nombre_actualizar').value.trim();

        const alumno = alumnos.find(a => a.nombre.toLowerCase() === alumno_nombre.toLowerCase());
        const materia = materias.find(m => m.nombre.toLowerCase() === materia_nombre.toLowerCase());
        const profesor = profesores.find(p => p.nombre.toLowerCase() === profesor_nombre.toLowerCase());

        if (!alumno) return mensajeActualizar.textContent = 'Alumno no encontrado';
        if (!materia) return mensajeActualizar.textContent = 'Materia no encontrada';
        if (!profesor) return mensajeActualizar.textContent = 'Profesor no encontrado';

        try {
            const calificaciones = await fetch(`${API_CALIFICACIONES}/listar`).then(r => r.json());
            const cal = calificaciones.find(c => 
                c.numero_de_control === numero_de_control && c.materia_id === materia.id
            );
            if (!cal) return mensajeActualizar.textContent = 'Calificación no encontrada para actualizar';

            const resp = await fetch(`${API_CALIFICACIONES}/actualizar/${cal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alumno_nombre,
                    numero_de_control,
                    materia_id: materia.id,
                    calificacion,
                    profesor_id: profesor.numero_de_control
                })
            }).then(r => r.json());

            mensajeActualizar.textContent = resp.message || 'Calificación actualizada correctamente';

        } catch (err) {
            mensajeActualizar.textContent = 'Error al actualizar calificación';
            console.error(err);
        }
    });

});
