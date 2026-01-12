const API_BASE = '/api/salones';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de salones cargado');

    // ================= BUSCAR =================
    const formBuscar = document.getElementById('formulario-buscar-salon');
    if (formBuscar) {
        formBuscar.addEventListener('submit', async (e) => {
            e.preventDefault();
            await buscarSalon();
        });
    }

    // ================= REGISTRAR ================= (NO MODIFICAR)
    const formRegistrar = document.getElementById('formulario-salon');
    if (formRegistrar) {
        formRegistrar.addEventListener('submit', e => {
            e.preventDefault();
            registrarSalon();
        });
    }

    // ================= ELIMINAR ================= (NO MODIFICAR)
    const formEliminar = document.getElementById('formulario-eliminar-salon');
    if (formEliminar) {
        formEliminar.addEventListener('submit', e => {
            e.preventDefault();
            eliminarSalon();
        });
    }
});

// ===== BUSCAR ===== (REESCRITA SEGÚN TU PATRÓN FUNCIONAL)
async function buscarSalon() {
    const id = document.getElementById('id_salon').value.trim();
    const mensaje = document.getElementById('mensaje-busqueda-salon');
    const datos = document.getElementById('datos-salon');

    // Validación simple como en tu ejemplo
    if (!id) {
        mensaje.textContent = 'Debes ingresar un ID de salón';
        mensaje.style.color = 'red';
        datos.style.display = 'none';
        return;
    }

    // Mostrar "buscando..."
    mensaje.textContent = 'Buscando salón...';
    mensaje.style.color = 'blue';

    try {
        // Hacer fetch igual que en tu ejemplo funcional
        const res = await fetch(`${API_BASE}/buscar/${id}`);
        const result = await res.json();

        // Manejar la respuesta como en tu ejemplo
        if (!res.ok || !result.success) {
            mensaje.textContent = result.message || 'Salón no encontrado';
            mensaje.style.color = 'red';
            datos.style.display = 'none';
            return;
        }

        // Mostrar los datos - FORMATO SIMPLE Y DIRECTO
        datos.innerHTML = `
            <div style="background:#f5f5f5; padding:15px; border-radius:5px; margin-top:10px;">
                <h3 style="margin-top:0;">Información del Salón</h3>
                <p><strong>ID:</strong> ${result.salon.id}</p>
                <p><strong>Nombre:</strong> ${result.salon.nombre}</p>
                <p><strong>Capacidad:</strong> ${result.salon.capacidad} personas</p>
                <p><strong>Número de Control del Profesor:</strong> ${result.salon.profesor_id}</p>
            </div>
        `;
        
        // Mostrar el contenedor
        datos.style.display = 'block';
        
        // Mensaje de éxito
        mensaje.textContent = 'Salón encontrado correctamente';
        mensaje.style.color = 'green';

    } catch (err) {
        console.error('Error al buscar salón:', err);
        mensaje.textContent = 'Error al conectar con el servidor';
        mensaje.style.color = 'red';
        datos.style.display = 'none';
    }
}

// ===== REGISTRAR ===== (MANTENIDO IGUAL)
function registrarSalon() {
    const nombre = document.getElementById('nombre_salon').value.trim();
    const capacidad = document.getElementById('capacidad').value.trim();
    const profesor_id = document.getElementById('numero_de_control').value.trim();
    const mensaje = document.getElementById('mensaje');

    if (!nombre || !capacidad || !profesor_id) {
        mensaje.textContent = 'Todos los campos son obligatorios';
        mensaje.style.color = 'red';
        return;
    }

    fetch(API_BASE + '/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, capacidad, profesor_id })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            mensaje.textContent = data.message;
            mensaje.style.color = 'green';
            document.getElementById('formulario-salon').reset();
        } else {
            mensaje.textContent = data.message;
            mensaje.style.color = 'red';
        }
    })
    .catch(() => {
        mensaje.textContent = 'Error de conexión con el servidor';
        mensaje.style.color = 'red';
    });
}

// ===== ELIMINAR ===== (MANTENIDO IGUAL)
function eliminarSalon() {
    const id = document.getElementById('id').value.trim();
    const mensaje = document.getElementById('mensaje-eliminar-salon');
    const datos = document.getElementById('datos-salon');

    if (!id) {
        mensaje.textContent = 'Ingrese el ID del salón';
        mensaje.style.color = 'orange';
        return;
    }

    if (!confirm('¿Seguro que desea eliminar este salón?')) return;

    fetch(API_BASE + '/eliminar/' + id, { method: 'DELETE' })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            mensaje.textContent = data.message;
            mensaje.style.color = 'green';
            datos.style.display = 'none';
            document.getElementById('formulario-eliminar-salon').reset();
        } else {
            mensaje.textContent = data.message;
            mensaje.style.color = 'red';
        }
    })
    .catch(() => {
        mensaje.textContent = 'Error de conexión';
        mensaje.style.color = 'red';
    });
}