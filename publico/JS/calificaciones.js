document.addEventListener('DOMContentLoaded', async () => {

    const API_ALUMNOS = '/api/alumnos/listar';
    const API_MATERIAS = '/api/materias/listar';
    const API_PROFESORES = '/api/profesores/listar';

    try {
        const [alumnos, materias, profesores] = await Promise.all([
            fetch(API_ALUMNOS).then(res => res.json()),
            fetch(API_MATERIAS).then(res => res.json()),
            fetch(API_PROFESORES).then(res => res.json())
        ]);

        llenarSelect('alumno_nombre_ingresar', alumnos, 'numero_de_control', 'nombre');
        llenarSelect('alumno_nombre_actualizar', alumnos, 'numero_de_control', 'nombre');
        llenarSelect('materia_id_ingresar', materias, 'id', 'nombre');
        llenarSelect('materia_id_actualizar', materias, 'id', 'nombre');
        llenarSelect('profesor_nombre_ingresar', profesores, 'numero_de_control', 'nombre');
        llenarSelect('profesor_nombre_actualizar', profesores, 'numero_de_control', 'nombre');

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
});
