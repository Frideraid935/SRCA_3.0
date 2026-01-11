const API_BASE = '/api/salones';

document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       REGISTRAR SALÓN
    ========================= */
    const formRegistrar = document.getElementById('formulario-salon');
    if (formRegistrar) {
        const mensaje = document.getElementById('mensaje');

        formRegistrar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                id_salon: document.getElementById('id_salon').value,
                nombre_salon: document.getElementById('nombre_salon').value,
                capacidad: document.getElementById('capacidad').value,
                profesor_id: document.getElementById('profesor_id').value
            };

            try {
                const res = await fetch(`${API_BASE}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                mensaje.textContent = result.message;
                mensaje.style.display = 'block';
                mensaje.className = res.ok ? 'mensaje mensaje-exito' : 'mensaje mensaje-error';

                if (res.ok) formRegistrar.reset();

            } catch (error) {
                mensaje.textContent = 'Error al conectar con el servidor';
                mensaje.className = 'mensaje mensaje-error';
                mensaje.style.display = 'block';
                console.error(error);
            }
        });
    }

    /* =========================
       BUSCAR SALÓN
    ========================= */
    const formBuscar = document.getElementById('formulario-buscar-salon');
    if (formBuscar) {
        const mensaje = document.getElementById('mensaje-busqueda-salon');
        const resultados = document.getElementById('resultados-busqueda-salon');
        const datos = document.getElementById('datos-salon');

        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('id').value.trim();
            mensaje.style.display = 'none';
            resultados.style.display = 'none';

            if (!id) {
                mensaje.textContent = 'Ingrese el ID del salón';
                mensaje.className = 'mensaje-error';
                mensaje.style.display = 'block';
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/buscar/${id}`);
                const salon = await res.json();

                if (!res.ok) {
                    mensaje.textContent = salon.message;
                    mensaje.className = 'mensaje-error';
                    mensaje.style.display = 'block';
                    return;
                }

                datos.innerHTML = `
                    <p><strong>ID:</strong> ${salon.id_salon}</p>
                    <p><strong>Nombre:</strong> ${salon.nombre_salon}</p>
                    <p><strong>Capacidad:</strong> ${salon.capacidad}</p>
                    <p><strong>Profesor:</strong> ${salon.profesor_id}</p>
                `;

                resultados.style.display = 'block';

            } catch (error) {
                mensaje.textContent = 'Error al conectar con el servidor';
                mensaje.className = 'mensaje-error';
                mensaje.style.display = 'block';
                console.error(error);
            }
        });
    }

    /* =========================
       ELIMINAR SALÓN
    ========================= */
    const formEliminar = document.getElementById('formulario-eliminar-salon');
    if (formEliminar) {
        const mensaje = document.getElementById('mensaje-eliminar-salon');
        const datos = document.getElementById('datos-salon');

        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('id').value.trim();
            mensaje.style.display = 'none';
            datos.style.display = 'none';

            try {
                const resBuscar = await fetch(`${API_BASE}/buscar/${id}`);
                const salon = await resBuscar.json();

                if (!resBuscar.ok) {
                    mensaje.textContent = salon.message;
                    mensaje.className = 'mensaje-error';
                    mensaje.style.display = 'block';
                    return;
                }

                datos.innerHTML = `
                    <p><strong>ID:</strong> ${salon.id_salon}</p>
                    <p><strong>Nombre:</strong> ${salon.nombre_salon}</p>
                `;
                datos.style.display = 'block';

                if (!confirm('¿Desea eliminar este salón?')) return;

                const res = await fetch(`${API_BASE}/eliminar/${id}`, {
                    method: 'DELETE'
                });

                const result = await res.json();
                mensaje.textContent = result.message;
                mensaje.className = res.ok ? 'mensaje-exito' : 'mensaje-error';
                mensaje.style.display = 'block';

                if (res.ok) {
                    datos.style.display = 'none';
                    formEliminar.reset();
                }

            } catch (error) {
                mensaje.textContent = 'Error al conectar con el servidor';
                mensaje.className = 'mensaje-error';
                mensaje.style.display = 'block';
                console.error(error);
            }
        });
    }
});
