const API_BASE = '/api/admin';

document.addEventListener('DOMContentLoaded', () => {

    /* ===============================
       REGISTRAR ADMINISTRADOR
    ================================ */
    const formRegistrar = document.getElementById('form-registrar-admin');
    if (formRegistrar) {
        const mensaje = document.getElementById('mensaje');

        formRegistrar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usuario = document.getElementById('usuario').value.trim();
            const contrasena = document.getElementById('contrasena').value.trim();

            if (!usuario || !contrasena) {
                mensaje.textContent = 'Todos los campos son obligatorios';
                mensaje.style.display = 'block';
                return;
            }

            mensaje.textContent = 'Registrando...';
            mensaje.style.display = 'block';

            try {
                const res = await fetch(`${API_BASE}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, contrasena })
                });

                const data = await res.json();

                mensaje.textContent = data.message;

                if (data.success) {
                    formRegistrar.reset();
                }

            } catch (error) {
                mensaje.textContent = 'Error de conexión';
                console.error(error);
            }
        });
    }

    /* ===============================
       ELIMINAR ADMINISTRADOR
    ================================ */
    const formEliminar = document.getElementById('form-eliminar-admin');
    if (formEliminar) {
        const mensaje = document.getElementById('mensaje');
        const btnEliminar = document.getElementById('btn-confirmar-eliminar');

        formEliminar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usuario = document.getElementById('usuario').value.trim();

            if (!usuario) {
                mensaje.textContent = 'Ingresa el usuario';
                mensaje.style.display = 'block';
                return;
            }

            if (!confirm(`¿Seguro que deseas eliminar al administrador "${usuario}"?`)) {
                return;
            }

            btnEliminar.disabled = true;
            btnEliminar.textContent = 'Eliminando...';

            try {
                const res = await fetch(`${API_BASE}/eliminar`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario })
                });

                const data = await res.json();

                mensaje.textContent = data.message;
                mensaje.style.display = 'block';

                if (data.success) {
                    formEliminar.reset();
                }

            } catch (error) {
                mensaje.textContent = 'Error de conexión';
                mensaje.style.display = 'block';
                console.error(error);
            } finally {
                btnEliminar.disabled = false;
                btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i> Eliminar';
            }
        });
    }

});
