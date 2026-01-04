document.addEventListener('DOMContentLoaded', () => {

    // ==========================
    // INGRESAR CALIFICACIÓN
    // ==========================
    const formIngresar = document.getElementById('formulario-ingresar');
    formIngresar?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_ingresar').value,
            numero_de_control: document.getElementById('numero_de_control_ingresar').value,
            materia_nombre: document.getElementById('materia_nombre_ingresar').value,
            calificacion: document.getElementById('calificacion_ingresar').value,
            profesor_nombre: document.getElementById('profesor_nombre_ingresar').value
        };

        try {
            const resp = await fetch('/api/calificaciones/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(r => r.json());

            document.getElementById('mensaje-ingresar').textContent = resp.message;
            if(resp.message.includes('correctamente')) formIngresar.reset();

        } catch (err) {
            console.error(err);
            document.getElementById('mensaje-ingresar').textContent = 'Error al registrar calificación';
        }
    });

    // ==========================
    // ACTUALIZAR CALIFICACIÓN
    // ==========================
    const btnBuscar = document.getElementById('btn-buscar-actualizar');
    const formActualizar = document.getElementById('formulario-actualizar');

    btnBuscar?.addEventListener('click', async () => {
        const nombreAlumno = document.getElementById('alumno_nombre_buscar').value.trim();
        if(!nombreAlumno) return alert('Ingrese un nombre de alumno para buscar');

        try {
            const calificaciones = await fetch(`/api/calificaciones/buscar?nombre=${encodeURIComponent(nombreAlumno)}`)
                .then(r => r.json());

            if(calificaciones.length === 0) return alert('No se encontraron calificaciones para este alumno');

            const cal = calificaciones[0];
            formActualizar.style.display = 'block';
            document.getElementById('id_actualizar').value = cal.id;
            document.getElementById('alumno_nombre_actualizar').value = cal.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = cal.numero_de_control;
            document.getElementById('materia_nombre_actualizar').value = cal.nombre_materia || '';
            document.getElementById('calificacion_actualizar').value = cal.calificacion;
            document.getElementById('profesor_nombre_actualizar').value = cal.nombre_profesor || '';

        } catch(err) {
            console.error(err);
            alert('Error al buscar calificación');
        }
    });

    const btnActualizar = document.getElementById('btn-actualizar');
    btnActualizar?.addEventListener('click', async () => {
        const id = document.getElementById('id_actualizar').value;
        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_actualizar').value,
            numero_de_control: document.getElementById('numero_de_control_actualizar').value,
            materia_nombre: document.getElementById('materia_nombre_actualizar').value,
            calificacion: document.getElementById('calificacion_actualizar').value,
            profesor_nombre: document.getElementById('profesor_nombre_actualizar').value
        };

        try {
            const resp = await fetch(`/api/calificaciones/actualizar/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json());

            document.getElementById('mensaje-actualizar').textContent = resp.message;

        } catch(err) {
            console.error(err);
            document.getElementById('mensaje-actualizar').textContent = 'Error al actualizar calificación';
        }
    });

});

