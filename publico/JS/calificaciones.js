document.addEventListener('DOMContentLoaded', async () => {

    const API_ALUMNOS = '/api/alumnos/listar';
    const API_MATERIAS = '/api/materias/listar';
    const API_PROFESORES = '/api/profesores/listar';

    // Cargar selects
    try {
        const [alumnos, materias, profesores] = await Promise.all([
            fetch(API_ALUMNOS).then(res => res.json()),
            fetch(API_MATERIAS).then(res => res.json()),
            fetch(API_PROFESORES).then(res => res.json())
        ]);

        llenarSelect('alumno_nombre_ingresar', alumnos, 'numero_de_control', 'nombre');
        llenarSelect('materia_id_ingresar', materias, 'id', 'nombre');
        llenarSelect('profesor_nombre_ingresar', profesores, 'numero_de_control', 'nombre');

    } catch (err) {
        console.error('Error al cargar datos para selects:', err);
    }

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

    // Enviar formulario
    const form = document.getElementById('formulario-ingresar');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Alumno: si no hay selección, usar manual
        const alumnoSelect = document.getElementById('alumno_nombre_ingresar');
        const alumnoManual = document.getElementById('alumno_nombre_manual').value.trim();
        const alumno_nombre = alumnoSelect.value ? alumnoSelect.selectedOptions[0].textContent : alumnoManual;

        const numero_de_control = document.getElementById('numero_de_control_ingresar').value.trim();

        // Materia: si no hay selección, usar manual
        const materiaSelect = document.getElementById('materia_id_ingresar');
        const materiaManual = document.getElementById('materia_manual').value.trim();
        const materia_id = materiaSelect.value || materiaManual;

        // Profesor: si no hay selección, usar manual
        const profesorSelect = document.getElementById('profesor_nombre_ingresar');
        const profesorManual = document.getElementById('profesor_manual').value.trim();
        const profesor_id = profesorSelect.value || profesorManual;

        const calificacion = document.getElementById('calificacion_ingresar').value;

        if (!alumno_nombre || !numero_de_control || !materia_id || !calificacion || !profesor_id) {
            return alert('Todos los campos son obligatorios');
        }

        try {
            const resp = await fetch('/api/calificaciones/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alumno_nombre,
                    numero_de_control,
                    materia_id,
                    calificacion,
                    profesor_id
                })
            }).then(r => r.json());

            if (resp.message) alert(resp.message);
            else alert('Calificación registrada');

            form.reset();
        } catch (err) {
            console.error(err);
            alert('Error al registrar calificación');
        }
    });

});
