const API = '/api/salones';

document.addEventListener('DOMContentLoaded', () => {

    /* ================= REGISTRAR ================= */
    const fReg = document.getElementById('formulario-salon');
    if (fReg) {
        const msg = document.getElementById('mensaje');

        fReg.addEventListener('submit', async e => {
            e.preventDefault();

            const data = {
                nombre: document.getElementById('nombre_salon').value.trim(),
                capacidad: document.getElementById('capacidad').value.trim(),
                profesor_id: document.getElementById('numero_de_control').value.trim()
            };

            try {
                const res = await fetch(`${API}/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const r = await res.json();
                msg.textContent = r.message;
                msg.className = res.ok ? 'mensaje mensaje-exito' : 'mensaje mensaje-error';
                msg.style.display = 'block';

                if (res.ok) fReg.reset();
            } catch {
                msg.textContent = 'Error de conexión';
                msg.className = 'mensaje mensaje-error';
                msg.style.display = 'block';
            }
        });
    }

    /* ================= BUSCAR ================= */
    const fBus = document.getElementById('formulario-buscar-salon');
    if (fBus) {
        const msg = document.getElementById('mensaje-busqueda-salon');
        const datos = document.getElementById('datos-salon');

        fBus.addEventListener('submit', async e => {
            e.preventDefault();
            msg.style.display = 'none';
            datos.style.display = 'none';

            const id = document.getElementById('id').value.trim();

            try {
                const res = await fetch(`${API}/buscar/${id}`);
                const r = await res.json();

                msg.textContent = r.message;
                msg.className = res.ok ? 'mensaje mensaje-exito' : 'mensaje mensaje-error';
                msg.style.display = 'block';

                if (!res.ok) return;

                const s = r.salon;
                datos.innerHTML = `
                    <p><b>ID:</b> ${s.id}</p>
                    <p><b>Nombre:</b> ${s.nombre}</p>
                    <p><b>Capacidad:</b> ${s.capacidad}</p>
                    <p><b>Profesor:</b> ${s.profesor_id}</p>
                `;
                datos.style.display = 'block';
            } catch {
                msg.textContent = 'Error de conexión';
                msg.className = 'mensaje mensaje-error';
                msg.style.display = 'block';
            }
        });
    }

    /* ================= ELIMINAR ================= */
    const fDel = document.getElementById('formulario-eliminar-salon');
    if (fDel) {
        const msg = document.getElementById('mensaje-eliminar-salon');
        const datos = document.getElementById('datos-salon');

        fDel.addEventListener('submit', async e => {
            e.preventDefault();
            msg.style.display = 'none';
            datos.style.display = 'none';

            const id = document.getElementById('id').value.trim();

            try {
                const res = await fetch(`${API}/eliminar/${id}`, { method: 'DELETE' });
                const r = await res.json();

                msg.textContent = r.message;
                msg.className = res.ok ? 'mensaje mensaje-exito' : 'mensaje mensaje-error';
                msg.style.display = 'block';

                if (res.ok) fDel.reset();
            } catch {
                msg.textContent = 'Error de conexión';
                msg.className = 'mensaje mensaje-error';
                msg.style.display = 'block';
            }
        });
    }
});
