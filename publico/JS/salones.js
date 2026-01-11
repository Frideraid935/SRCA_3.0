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
                nombre: document.getElementById('nombre_salon').value.trim(),
                capacidad: document.getElementById('capacidad').value.trim(),
                profesor_id: document.getElementById('profesor_id').value.trim()
            };

            try {
                const res = await fetch(`${API_BASE}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                mensaje.textContent = result.message;
                mensaje.className = res.ok ? 'mensaje-exito' : 'mensaje-error';
                mensaje.style.display = 'block';

                if (res.ok) formRegistrar.reset();

            } catch {
                mensaje.textContent = 'Error al conectar con el servidor';
                mensaje.className = 'mensaje-error';
                mensaje.style.display = 'block';
            }
        });
    }

    /* =========================
       BUSCAR SALÓN
    ========================= */
    const formBuscar = document.getElementById('formulario-buscar-salon');
    if (formBuscar) {
        const mensaje = document.getElementById('mensaje-busqueda-salon');
        const datos = document.getElementById('datos-salon');

        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('id_salon').value.trim();

            try {
                const res = await fetch(`${API_BASE}/buscar/${id}`);
                const salon = await res.json();

                if (!res.ok) {
                    mensaje.textContent = salon.message;
                    mensaje.className = 'mensaje-error';
                    mensaje.style.display = 'block';
                    datos.style.display = 'none';
                    return;
                }

                datos.innerHTML = `
                    <p><strong>ID:</strong> ${salon.id}</p>
                    <p><strong>Salón:</strong> ${salon.nombre}</p>
                    <p><strong>Capacidad:</strong> ${salon.capacidad}</p>
                    <p><strong>Profesor:</strong> ${salon.profesor_id}</p>
                `;
                datos.style.display = 'block';
                mensaje.style.display = 'none';

            } catch {
                mensaje.textContent = 'Error de conexión';
                mensaje.className = 'mensaje-error';
                mensaje.style.display = 'block';
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
            const id = document.getElementById('id_salon').value.trim();

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
                    <p><strong>Salón:</strong> ${salon.nombre}</p>
                    <p><strong>Profesor:</strong> ${salon.profesor_id}</p>
                `;
                datos.style.display = 'block';

                if (!confirm('¿Desea eliminar este salón?')) return;

                const res = await fetch(`${API_BASE}/eliminar/${id}`, { method: 'DELETE' });
                const result = await res.json();

                mensaje.textContent = result.message;
                mensaje.className = res.ok ? 'mensaje-exito' : 'mensaje-error';
                mensaje.style.display = 'block';

                if (res.ok) {
                    datos.style.display = 'none';
                    formEliminar.reset();
                }

            } catch {
                mensaje.textContent = 'Error de conexión';
                mensaje.className = 'mensaje-error';
                mensaje.style.display = 'block';
            }
        });
    }
});
