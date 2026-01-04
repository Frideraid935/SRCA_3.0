document.addEventListener('DOMContentLoaded', () => {

    // ===== INGRESAR CALIFICACIÓN =====
    const formIngresar = document.getElementById('formulario-ingresar');
    const mensajeIngresar = document.getElementById('mensaje-ingresar');

    formIngresar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_ingresar').value.trim(),
            numero_de_control: document.getElementById('numero_de_control_ingresar').value.trim(),
            materia: document.getElementById('materia_ingresar').value.trim(),
            calificacion: document.getElementById('calificacion_ingresar').value.trim(),
            profesor: document.getElementById('profesor_ingresar').value.trim()
        };

        try {
            const resp = await fetch('/api/calificaciones/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await resp.json();
            mensajeIngresar.textContent = result.message;
            mensajeIngresar.style.color = resp.ok ? 'green' : 'red';
            if (resp.ok) formIngresar.reset();
        } catch (err) {
            console.error(err);
            mensajeIngresar.textContent = 'Error de conexión con el servidor';
            mensajeIngresar.style.color = 'red';
        }
    });

    // ===== ACTUALIZAR CALIFICACIÓN =====
    const formBuscar = document.getElementById('formulario-buscar');
    const formActualizar = document.getElementById('formulario-actualizar');
    const mensajeBuscar = document.getElementById('mensaje-buscar');
    const mensajeActualizar = document.getElementById('mensaje-actualizar');

    formBuscar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const alumno_nombre = document.getElementById('alumno_nombre_buscar').value.trim();
        const materia = document.getElementById('materia_buscar').value.trim();

        try {
            const resp = await fetch(`/api/calificaciones/buscar?alumno_nombre=${encodeURIComponent(alumno_nombre)}&materia=${encodeURIComponent(materia)}`);
            const result = await resp.json();

            if (resp.ok && result) {
                formActualizar.style.display = 'block';
                mensajeBuscar.textContent = '';
                document.getElementById('calificacion_actualizar').value = result.calificacion;
                document.getElementById('profesor_actualizar').value = result.profesor;
            } else {
                mensajeBuscar.textContent = result.message || 'Calificación no encontrada';
                mensajeBuscar.style.color = 'red';
                formActualizar.style.display = 'none';
            }
        } catch (err) {
            console.error(err);
            mensajeBuscar.textContent = 'Error de conexión con el servidor';
            mensajeBuscar.style.color = 'red';
        }
    });

    formActualizar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_buscar').value.trim(),
            materia: document.getElementById('materia_buscar').value.trim(),
            calificacion: document.getElementById('calificacion_actualizar').value.trim(),
            profesor: document.getElementById('profesor_actualizar').value.trim()
        };

        try {
            const resp = await fetch('/api/calificaciones/actualizar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await resp.json();
            mensajeActualizar.textContent = result.message;
            mensajeActualizar.style.color = resp.ok ? 'green' : 'red';
        } catch (err) {
            console.error(err);
            mensajeActualizar.textContent = 'Error de conexión con el servidor';
            mensajeActualizar.style.color = 'red';
        }
    });

});
