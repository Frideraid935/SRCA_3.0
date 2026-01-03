// publico/JS/admin.js

const API_BASE = '/api/admin';

document.addEventListener('DOMContentLoaded', () => {
    console.log('admin.js cargado');

    if (document.getElementById('form-registrar-admin')) {
        configurarRegistro();
    }

    if (document.getElementById('form-buscar-admin')) {
        configurarBusquedaYEliminacion();
    }
});

/* =========================
   REGISTRAR ADMIN
========================= */
function configurarRegistro() {
    const form = document.getElementById('form-registrar-admin');
    const btn = form.querySelector('button[type="submit"]');
    const mensaje = document.getElementById('mensaje');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();

        if (!usuario || !contrasena) {
            mostrarMensaje(mensaje, 'Todos los campos son obligatorios', 'error');
            return;
        }

        btn.disabled = true;
        btn.innerText = 'REGISTRANDO...';

        try {
            const res = await fetch(`${API_BASE}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contrasena })
            });

            const data = await res.json();

            if (data.success) {
                mostrarMensaje(mensaje, data.message, 'success');
                form.reset();
            } else {
                mostrarMensaje(mensaje, data.message, 'error');
            }

        } catch (error) {
            console.error(error);
            mostrarMensaje(mensaje, 'Error de conexión con el servidor', 'error');
        } finally {
            btn.disabled = false;
            btn.innerText = 'Registrar';
        }
    });
}

/* =========================
   BUSCAR Y ELIMINAR ADMIN
========================= */
function configurarBusquedaYEliminacion() {
    const formBuscar = document.getElementById('form-buscar-admin');
    const btnEliminar = document.getElementById('btn-confirmar-eliminar');
    const mensaje = document.getElementById('mensaje');
    const infoDiv = document.getElementById('info-admin');
    const infoUsuario = document.getElementById('info-usuario');

    formBuscar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value.trim();

        if (!usuario) {
            mostrarMensaje(mensaje, 'Escriba un usuario', 'error');
            return;
        }

        infoDiv.style.display = 'none';
        mensaje.style.display = 'none';

        try {
            const res = await fetch(`${API_BASE}/buscar?usuario=${encodeURIComponent(usuario)}`);
            const data = await res.json();

            if (data.success && data.admin && data.admin.usuario) {
                infoUsuario.textContent = data.admin.usuario;
                infoDiv.style.display = 'block';
                mostrarMensaje(mensaje, data.message, 'success');
            } else {
                mostrarMensaje(mensaje, data.message || 'Administrador no encontrado', 'error');
            }

        } catch (error) {
            console.error(error);
            mostrarMensaje(mensaje, 'Error de conexión', 'error');
        }
    });

    btnEliminar.addEventListener('click', async () => {
        const usuario = infoUsuario.textContent;

        if (!usuario) {
            mostrarMensaje(mensaje, 'Primero busque un administrador', 'error');
            return;
        }

        if (!confirm(`¿Eliminar al administrador ${usuario}?`)) return;

        btnEliminar.disabled = true;
        btnEliminar.innerText = 'ELIMINANDO...';

        try {
            const res = await fetch(`${API_BASE}/eliminar`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario })
            });

            const data = await res.json();

            if (data.success) {
                mostrarMensaje(mensaje, data.message, 'success');
                infoDiv.style.display = 'none';
                document.getElementById('usuario').value = '';
                infoUsuario.textContent = '';
            } else {
                mostrarMensaje(mensaje, data.message, 'error');
            }

        } catch (error) {
            console.error(error);
            mostrarMensaje(mensaje, 'Error de conexión', 'error');
        } finally {
            btnEliminar.disabled = false;
            btnEliminar.innerText = 'Confirmar Eliminación';
        }
    });
}

/* =========================
   MENSAJES
========================= */
function mostrarMensaje(div, texto, tipo) {
    div.innerText = texto;
    div.className = `mensaje mensaje-${tipo}`;
    div.style.display = 'block';
}
