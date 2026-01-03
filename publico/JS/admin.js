// publico/JS/admin.js
const API_BASE = '/api/admin';

document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       REGISTRAR ADMIN
    ========================= */
    const formRegistrar = document.getElementById('form-registrar-admin');

    if (formRegistrar) {
        const btnRegistrar = formRegistrar.querySelector('button[type="submit"]');
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

            btnRegistrar.disabled = true;
            btnRegistrar.textContent = 'REGISTRANDO...';

            try {
                const res = await fetch(`${API_BASE}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, contrasena })
                });

                const data = await res.json();
                mensaje.textContent = data.message;
                mensaje.style.display = 'block';

                if (data.success) {
                    formRegistrar.reset();
                }

            } catch (error) {
                mensaje.textContent = 'Error de conexión';
                mensaje.style.display = 'block';
                console.error(error);
            } finally {
                btnRegistrar.disabled = false;
                btnRegistrar.textContent = 'Registrar';
            }
        });
    }

    /* =========================
       ELIMINAR ADMIN (DIRECTO)
    ========================= */
    const btnEliminar = document.getElementById('btn-confirmar-eliminar');

    if (btnEliminar) {
        const mensaje = document.getElementById('mensaje');

        btnEliminar.addEventListener('click', async () => {
            const usuario = document.getElementById('usuario').value.trim();

            if (!usuario) {
                mensaje.textContent = 'Escriba el usuario a eliminar';
                mensaje.style.display = 'block';
                return;
            }

            if (!confirm(`¿Eliminar al administrador ${usuario}?`)) return;

            btnEliminar.disabled = true;
            btnEliminar.textContent = 'ELIMINANDO...';

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
                    document.getElementById('usuario').value = '';
                }

            } catch (error) {
                mensaje.textContent = 'Error de conexión';
                mensaje.style.display = 'block';
                console.error(error);
            } finally {
                btnEliminar.disabled = false;
                btnEliminar.textContent = 'Confirmar Eliminación';
            }
        });
    }
});
