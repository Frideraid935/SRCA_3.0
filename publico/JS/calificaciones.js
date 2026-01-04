const API_ALUMNOS = '/api/alumnos/listar';
const API_MATERIAS = '/api/materias/listar';
const API_PROFESORES = '/api/profesores/listar';
const API_CALIFICACIONES = '/api/calificaciones';

document.addEventListener('DOMContentLoaded', async () => {

    async function cargarSelects() {
        try {
            const [alumnos, materias, profesores] = await Promise.all([
                fetch(API_ALUMNOS).then(r => r.json()),
                fetch(API_MATERIAS).then(r => r.json()),
                fetch(API_PROFESORES).then(r => r.json())
            ]);

            llenarSelect('alumno_nombre_ingresar', alumnos, 'nombre');
            llenarSelect('materia_id_ingresar', materias, 'nombre');
            llenarSelect('profesor_nombre_ingresar', profesores, 'nombre');

            llenarSelect('alumno_nombre_actualizar_form', alumnos, 'nombre');
            llenarSelect('materia_id_actualizar_form', materias, 'nombre');
            llenarSelect('profesor_nombre_actualizar', profesores, 'nombre');
        } catch (err) {
            console.error('Error al cargar selects:', err);
        }
    }

    function llenarSelect(id, datos, campo) {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">--Seleccione--</option>';
        datos.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d[campo];
            opt.textContent = d[campo];
            select.appendChild(opt);
        });
    }

    await cargarSelects();

    // ====================== Registrar ======================
    document.getElementById('formulario-ingresarP')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_ingresar').value,
            numero_de_control: document.getElementById('numero_de_control_ingresar').value,
            materia_nombre: document.getElementById('materia_id_ingresar').value,
            calificacion: document.getElementById('calificacion_ingresar').value,
            profesor_nombre: document.getElementById('profesor_nombre_ingresar').value
        };

        const mensaje = document.getElementById('mensaje-ingresar');

        try {
            const res = await fetch(`${API_CALIFICACIONES}/registrar`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            const result = await res.json();
            mensaje.textContent = result.message;
            mensaje.style.color = res.ok ? 'green' : 'red';
        } catch (err) {
            mensaje.textContent = 'Error al conectar con el servidor';
            mensaje.style.color = 'red';
            console.error(err);
        }
    });

    // ====================== Buscar para actualizar ======================
    document.getElementById('btn-buscar-actualizar')?.addEventListener('click', async () => {
        const alumno = document.getElementById('alumno_nombre_actualizar_form').value;
        const materia = document.getElementById('materia_id_actualizar_form').value;
        const mensaje = document.getElementById('mensaje-actualizar');
        const form = document.getElementById('formulario-actualizar');

        if (!alumno || !materia) {
            mensaje.textContent = 'Alumno y materia son requeridos';
            mensaje.style.color = 'red';
            form.style.display = 'none';
            return;
        }

        try {
            const res = await fetch(`${API_CALIFICACIONES}/buscar?alumno_nombre=${encodeURIComponent(alumno)}&materia_nombre=${encodeURIComponent(materia)}`);
            const result = await res.json();

            if (!res.ok) {
                mensaje.textContent = result.message;
                mensaje.style.color = 'red';
                form.style.display = 'none';
                return;
            }

            form.style.display = 'block';
            mensaje.textContent = '';
            document.getElementById('id_actualizar').value = result.id;
            document.getElementById('alumno_nombre_actualizar_form').value = result.alumno_nombre;
            document.getElementById('numero_de_control_actualizar').value = result.numero_de_control;
            document.getElementById('materia_id_actualizar_form').value = result.nombre_materia;
            document.getElementById('calificacion_actualizar').value = result.calificacion;
            document.getElementById('profesor_nombre_actualizar').value = result.nombre_profesor;

        } catch (err) {
            mensaje.textContent = 'Error al conectar con el servidor';
            mensaje.style.color = 'red';
            form.style.display = 'none';
            console.error(err);
        }
    });

    // ====================== Actualizar ======================
    document.getElementById('btn-actualizar')?.addEventListener('click', async () => {
        const id = document.getElementById('id_actualizar').value;
        const data = {
            alumno_nombre: document.getElementById('alumno_nombre_actualizar_form').value,
            numero_de_control: document.getElementById('numero_de_control_actualizar').value,
            materia_nombre: document.getElementById('materia_id_actualizar_form').value,
            calificacion: document.getElementById('calificacion_actualizar').value,
            profesor_nombre: document.getElementById('profesor_nombre_actualizar').value
        };
        const mensaje = document.getElementById('mensaje-actualizar');

        if (!id) {
            mensaje.textContent = 'Primero busca la calificación a actualizar';
            mensaje.style.color = 'red';
            return;
        }

        try {
            const res = await fetch(`${API_CALIFICACIONES}/actualizar/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            const result = await res.json();
            mensaje.textContent = result.message;
            mensaje.style.color = res.ok ? 'green' : 'red';
        } catch (err) {
            mensaje.textContent = 'Error al conectar con el servidor';
            mensaje.style.color = 'red';
            console.error(err);
        }
    });

});
