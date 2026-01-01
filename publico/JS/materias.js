// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Materias JS cargado');
    
    // ===== REGISTRAR MATERIA =====
    const formRegistro = document.getElementById('formulario-ingresar');
    if (formRegistro) {
        console.log('Formulario de registro encontrado');
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // ===== ELIMINAR MATERIA =====
    // Verificar si estamos en página de eliminar
    if (window.location.pathname.includes('eliminar')) {
        console.log('Página de eliminación detectada');
        inicializarEliminacion();
    }
});

// ========== FUNCIÓN PARA REGISTRAR MATERIA ==========
function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    
    if (!inputNombre || !btnGuardar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre es obligatorio');
        inputNombre.focus();
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnGuardar.innerHTML;
    
    // Cambiar estado
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    const datos = { nombre: nombre };
    
    console.log('Registrando:', datos);
    
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('Status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Respuesta:', data);
        
        if (data.success) {
            alert(data.message);
            inputNombre.value = ''; // Limpiar campo
            
            // Si estamos en página de eliminar, limpiar búsqueda
            if (window.location.pathname.includes('eliminar')) {
                limpiarBusqueda();
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión');
    })
    .finally(() => {
        // IMPORTANTE: SIEMPRE RESTAURAR EL BOTÓN
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
    });
}

// ========== FUNCIONES PARA ELIMINAR MATERIA ==========
function inicializarEliminacion() {
    console.log('Inicializando sistema de eliminación...');
    
    // Buscar o crear contenedor para eliminar
    const container = document.querySelector('.container, main, .contenedor') || document.body;
    
    // Verificar si ya existe el formulario de búsqueda
    let busquedaDiv = document.getElementById('eliminar-busqueda-div');
    if (!busquedaDiv) {
        // Crear estructura HTML para eliminar
        busquedaDiv = document.createElement('div');
        busquedaDiv.id = 'eliminar-busqueda-div';
        busquedaDiv.style.cssText = `
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        `;
        
        busquedaDiv.innerHTML = `
            <h3 style="color: #dc3545; margin-bottom: 20px;">
                <i class="fas fa-trash-alt"></i> Eliminar Materia
            </h3>
            
            <!-- Búsqueda por nombre -->
            <div class="form-group">
                <label style="font-weight: bold; margin-bottom: 8px; display: block;">
                    <i class="fas fa-search"></i> Buscar materia por nombre:
                </label>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" 
                           id="buscar-materia-input" 
                           placeholder="Ej: Matemáticas, Física, etc."
                           style="flex: 1; padding: 10px; border: 1px solid #ced4da; border-radius: 4px;"
                           autocomplete="off">
                    <button id="btn-buscar-eliminar" 
                            style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-search"></i> Buscar
                    </button>
                </div>
                <small style="color: #6c757d;">
                    Escribe el nombre exacto o parcial de la materia
                </small>
            </div>
            
            <!-- Resultado de búsqueda -->
            <div id="resultado-materia" style="display: none; margin-top: 20px;">
                <h5 style="color: #28a745;">
                    <i class="fas fa-check-circle"></i> Materia encontrada:
                </h5>
                
                <!-- Información de la materia -->
                <div id="info-materia" style="padding: 15px; background: white; border-radius: 6px; border: 2px solid #28a745; margin: 10px 0;">
                    <div style="margin-bottom: 10px;">
                        <strong>ID:</strong> <span id="materia-id-encontrada" style="font-weight: bold;">-</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Nombre:</strong> <span id="materia-nombre-encontrada" style="font-weight: bold; color: #28a745;">-</span>
                    </div>
                </div>
                
                <!-- Botón ELIMINAR (solo aparece aquí) -->
                <div id="btn-eliminar-container" style="text-align: center; margin-top: 20px; display: none;">
                    <button id="btn-eliminar-materia" 
                            style="padding: 12px 30px; background: #dc3545; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-trash"></i> ELIMINAR ESTA MATERIA
                    </button>
                    <button id="btn-cancelar-eliminar" 
                            style="padding: 12px 30px; background: #6c757d; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </div>
            
            <!-- Mensajes -->
            <div id="mensaje-eliminar" style="margin-top: 15px;"></div>
        `;
        
        container.prepend(busquedaDiv);
        
        // Agregar eventos
        document.getElementById('btn-buscar-eliminar').addEventListener('click', buscarMateriaParaEliminar);
        document.getElementById('buscar-materia-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') buscarMateriaParaEliminar();
        });
        document.getElementById('btn-eliminar-materia').addEventListener('click', confirmarEliminacionMateria);
        document.getElementById('btn-cancelar-eliminar').addEventListener('click', cancelarEliminacion);
    }
}

function buscarMateriaParaEliminar() {
    const input = document.getElementById('buscar-materia-input');
    const btnBuscar = document.getElementById('btn-buscar-eliminar');
    
    if (!input || !btnBuscar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const nombre = input.value.trim();
    
    if (!nombre) {
        mostrarMensajeEliminar('Escribe el nombre de la materia', 'warning');
        input.focus();
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnBuscar.innerHTML;
    
    // Cambiar estado
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    
    // Ocultar resultados anteriores
    document.getElementById('resultado-materia').style.display = 'none';
    document.getElementById('btn-eliminar-container').style.display = 'none';
    
    // Realizar búsqueda
    console.log('Buscando para eliminar:', nombre);
    
    fetch(`${API_BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`)
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta búsqueda:', data);
        
        if (data.success) {
            // Mostrar la materia encontrada
            mostrarMateriaParaEliminar(data.materia);
            mostrarMensajeEliminar('✅ Materia encontrada. Revisa la información abajo.', 'success');
        } else {
            mostrarMensajeEliminar(data.message, 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensajeEliminar('Error de conexión', 'danger');
    })
    .finally(() => {
        // Restaurar botón
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = textoOriginal;
    });
}

function mostrarMateriaParaEliminar(materia) {
    console.log('Mostrando materia para eliminar:', materia);
    
    // Mostrar información
    document.getElementById('materia-id-encontrada').textContent = materia.id;
    document.getElementById('materia-nombre-encontrada').textContent = materia.nombre;
    
    // Mostrar contenedores
    document.getElementById('resultado-materia').style.display = 'block';
    document.getElementById('info-materia').style.display = 'block';
    document.getElementById('btn-eliminar-container').style.display = 'block';
    
    // Desplazar vista
    document.getElementById('resultado-materia').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function confirmarEliminacionMateria() {
    const id = document.getElementById('materia-id-encontrada').textContent;
    const nombre = document.getElementById('materia-nombre-encontrada').textContent;
    
    if (!id || id === '-') {
        mostrarMensajeEliminar('Primero busca una materia', 'warning');
        return;
    }
    
    // Confirmación DOBLE
    if (!confirm(`¿ESTÁS SEGURO DE ELIMINAR ESTA MATERIA?\n\nMATERIA: ${nombre}\nID: ${id}\n\n⚠️ Esta acción NO se puede deshacer.`)) {
        return;
    }
    
    const btnEliminar = document.getElementById('btn-eliminar-materia');
    const textoOriginal = btnEliminar.innerHTML;
    
    btnEliminar.disabled = true;
    btnEliminar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
    
    // Enviar solicitud de eliminación
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`✅ ${data.message}\n\nMateria eliminada: ${nombre}`);
            limpiarBusqueda();
        } else {
            alert(`❌ ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Error de conexión');
    })
    .finally(() => {
        btnEliminar.disabled = false;
        btnEliminar.innerHTML = textoOriginal;
    });
}

function cancelarEliminacion() {
    limpiarBusqueda();
    document.getElementById('buscar-materia-input').focus();
}

function limpiarBusqueda() {
    // Ocultar resultados
    document.getElementById('resultado-materia').style.display = 'none';
    document.getElementById('btn-eliminar-container').style.display = 'none';
    
    // Limpiar campos
    document.getElementById('materia-id-encontrada').textContent = '-';
    document.getElementById('materia-nombre-encontrada').textContent = '-';
    
    // Limpiar mensajes
    document.getElementById('mensaje-eliminar').innerHTML = '';
    
    // Limpiar input de búsqueda (opcional)
    // document.getElementById('buscar-materia-input').value = '';
}

function mostrarMensajeEliminar(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    let clase = 'alert ';
    
    switch(tipo) {
        case 'success': clase += 'alert-success'; break;
        case 'danger': clase += 'alert-danger'; break;
        case 'warning': clase += 'alert-warning'; break;
        default: clase += 'alert-info';
    }
    
    mensajeDiv.innerHTML = `
        <div class="${clase}" style="padding: 10px; border-radius: 4px; margin-top: 10px;">
            ${texto}
        </div>
    `;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
}

// ========== EXPORTAR FUNCIONES ==========
window.registrarMateria = registrarMateria;
window.buscarMateriaParaEliminar = buscarMateriaParaEliminar;
window.confirmarEliminacionMateria = confirmarEliminacionMateria;