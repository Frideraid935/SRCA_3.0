const API_SALONES = '/api/salones';
const API_PROFESORES = '/api/profesores/listar';

document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     CARGAR PROFESORES
  ========================= */
  const selectProfesor = document.getElementById('profesor_id');
  if (selectProfesor) {
    fetch(API_PROFESORES)
      .then(res => res.json())
      .then(data => {
        data.forEach(p => {
          const option = document.createElement('option');
          option.value = p.numero_de_control;
          option.textContent = `${p.numero_de_control} - ${p.nombre}`;
          selectProfesor.appendChild(option);
        });
      });
  }

  /* =========================
     REGISTRAR
  ========================= */
  const formRegistrar = document.getElementById('formulario-salon');
  const mensaje = document.getElementById('mensaje');

  if (formRegistrar) {
    formRegistrar.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        nombre: document.getElementById('nombre').value.trim(),
        capacidad: document.getElementById('capacidad').value.trim(),
        profesor_id: document.getElementById('profesor_id').value
      };

      const res = await fetch(`${API_SALONES}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      mensaje.textContent = result.message;
      mensaje.className = res.ok ? 'mensaje-exito' : 'mensaje-error';
      mensaje.style.display = 'block';

      if (res.ok) formRegistrar.reset();
    });
  }

  /* =========================
     BUSCAR
  ========================= */
  const formBuscar = document.getElementById('formulario-buscar-salon');
  const datos = document.getElementById('datos-salon');
  const msgBuscar = document.getElementById('mensaje-busqueda-salon');

  if (formBuscar) {
    formBuscar.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('id').value;

      const res = await fetch(`${API_SALONES}/buscar/${id}`);
      const data = await res.json();

      if (!res.ok) {
        msgBuscar.textContent = data.message;
        msgBuscar.style.display = 'block';
        datos.style.display = 'none';
        return;
      }

      datos.innerHTML = `
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Salón:</strong> ${data.nombre}</p>
        <p><strong>Capacidad:</strong> ${data.capacidad}</p>
        <p><strong>Profesor:</strong> ${data.profesor_nombre}</p>
      `;
      datos.style.display = 'block';
      msgBuscar.style.display = 'none';
    });
  }

  /* =========================
     ELIMINAR
  ========================= */
  const formEliminar = document.getElementById('formulario-eliminar-salon');
  const msgEliminar = document.getElementById('mensaje-eliminar-salon');

  if (formEliminar) {
    formEliminar.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('id').value;

      if (!confirm('¿Eliminar salón?')) return;

      const res = await fetch(`${API_SALONES}/eliminar/${id}`, { method: 'DELETE' });
      const result = await res.json();

      msgEliminar.textContent = result.message;
      msgEliminar.className = res.ok ? 'mensaje-exito' : 'mensaje-error';
      msgEliminar.style.display = 'block';

      if (res.ok) formEliminar.reset();
    });
  }

});
