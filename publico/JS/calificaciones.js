const API_BASE = '/api/calificaciones';

document.addEventListener('DOMContentLoaded', () => {

    /* ===== REGISTRAR ===== */
    const formRegistrar = document.getElementById('form-registrar-calificacion');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datos = {
                alumno_nombre: document.getElementById('alumno').value.trim(),
                numero_de_control: document.getElementById('control').value.trim(),
                materia_id: document.getElementById('materia').value,
                calificacion: document.getElementById('calificacion').value,
                profesor_id: document.getElementById('profesor').value.trim()
            };

            enviar(`${API_BASE}/registrar`, 'POST', datos);
        });
    }

    /* ===== BUSCAR ===== */
    const btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', async () => {
            const id = document.getElementById('id_calificacion').value;
            if (!id) return alert('Ingrese el ID');

            const res = await fetch(`${API_BASE}/buscar?id=${id}`);
            const data = await res.json();

            if (!data.success) return alert(data.message);

            document.getElementById('form-actualizar-calificacion').style.display = 'block';

            document.getElementById('alumno').value = data.calificacion.alumno_nombre;
            document.getElementById('control').value = data.calificacion.numero_de_control;
            document.getElementById('materia').value = data.calificacion.materia_id;
            document.getElementById('calificacion').value = data.calificacion.calificacion;
            document.getElementById('profesor').value = data.calificacion.profesor_id;
        });
    }

    /* ===== ACTUALIZAR ===== */
    const formActualizar = document.getElementById('form-actualizar-calificacion');
    if (formActualizar) {
        formActualizar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datos = {
                id: document.getElementById('id_calificacion').value,
                alumno_nombre: document.getElementById('alumno').value.trim(),
                numero_de_control: document.getElementById('control').value.trim(),
                materia_id: document.getElementById('materia').value,
                calificacion: document.getElementById('calificacion').value,
                profesor_id: document.getElementById('profesor').value.trim()
            };

            enviar(`${API_BASE}/actualizar`, 'PUT', datos);
        });
    }
});

async function enviar(url, metodo, datos) {
    const mensaje = document.getElementById('mensaje');
    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const data = await res.json();
        mensaje.textContent = data.message;
    } catch {
        mensaje.textContent = 'Error de conexión';
    }
}
