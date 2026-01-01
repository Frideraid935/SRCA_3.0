// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Materias JS cargado');
    
    // Formulario de registro
    const formRegistro = document.getElementById('formulario-ingresar');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // Página de eliminación
    if (window.location.pathname.includes('eliminar')) {
        setTimeout(() => {
            inicializarBusquedaEliminar();
        }, 100);
    }
});

// ========== REGISTRAR MATERIA (CORREGIDO) ==========
function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    
    if (!inputNombre || !btnGuardar) {
        alert('Error: Formulario no encontrado');
        return;
    }
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('El nombre es obligatorio');
        return;
    }
    
    // Guardar estado original
    const textoOriginal = btnGuardar.innerHTML;
    const estadoOriginal = btnGuardar.disabled;
    
    // Cambiar estado
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = 'Enviando...';
    
    // Datos
    const datos = { nombre: nombre };
    
    console.log('📤 Enviando:', datos);
    
    // Enviar
    fetch(API_BASE_URL + '/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log('📥 Respuesta:', data);
        
        if (data.success) {
            alert('✅ ' + data.message);
            inputNombre.value = '';
            
            // Limpiar búsqueda si estamos en página de eliminar
            if (window.location.pathname.includes('eliminar')) {
                const busquedaInput = document.getElementById('buscar-input');
                if (busquedaInput) busquedaInput.value = '';
                ocultarResultados();
                ocultarSeleccion();
            }
        } else {
            alert('❌ ' + data.message);
        }
    })
    .catch(error => {
        console.error('❌ Error:', error);
        alert('⚠️ Error de conexión');
    })
    .finally(() => {
        // IMPORTANTE: SIEMPRE RESTAURAR EL BOTÓN
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
    });
}

// ========== SISTEMA DE ELIMINACIÓN ==========
function inicializarBusquedaEliminar() {
    console.log('🔍 Inicializando búsqueda para eliminar...');
    
    // Buscar o crear contenedor
    let container = document.querySelector('.container, main, .contenedor, .content, .app-container') || document.body;
    
    let busquedaDiv = document.getElementById('eliminar-busqueda-container');
    if (!busquedaDiv) {
        busquedaDiv = document.createElement('div');
        busquedaDiv.id = 'eliminar-busqueda-container';
        container.prepend(busquedaDiv);
    }
    
    // HTML simple
    busquedaDiv.innerHTML = `
        <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
            <h3 style="margin-bottom: 20px; color: #333;">
                <i class="fas fa-trash-alt" style="color: #dc3545;"></i> Eliminar Materia
            </h3>
            
            <!-- Búsqueda -->
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    Buscar materia por nombre:
                </label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" 
                           id="buscar-input" 
                           placeholder="Ej: Matemáticas"
                           style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"
                           autocomplete="off">
                    <button id="btn-buscar" 
                            style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-search"></i> Buscar
                    </button>
                </div>
                <small style="color: #666; display: block; margin-top: 5px;">
                    Escribe al menos 2 letras del nombre
                </small>
            </div>
            
            <!-- Resultados -->
            <div id="resultados-container" style="display: none; margin-top: 20px;">
                <h5 style="margin-bottom: 10px;">Resultados:</h5>
                <div id="lista-resultados" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;"></div>
            </div>
            
            <!-- Materia seleccionada -->
            <div id="seleccion-container" style="display: none; margin-top: 20px; padding: 15px; border: 2px solid #28a745; border-radius: 6px; background: #f8fff9;">
                <h5 style="color: #28a745; margin-bottom: 15px;">
                    <i class="fas fa-check-circle"></i> Materia seleccionada para eliminar:
                </h5>
                <div style="margin-bottom: 15px;">
                    <p><strong>ID:</strong> <span id="selected-id" style="font-weight: bold;">-</span></p>
                    <p><strong>Nombre:</strong> <span id="selected-nombre" style="font-weight: bold; color: #28a745;">-</span></p>
                </div>
                <div style="text-align: center;">
                    <button id="btn-eliminar-final" 
                            style="padding: 12px 30px; background: #dc3545; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-trash"></i> ELIMINAR MATERIA
                    </button>
                    <button id="btn-cancelar-busqueda" 
                            style="padding: 12px 30px; background: #6c757d; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </div>
            
            <!-- Mensajes -->
            <div id="mensaje-area" style="margin-top: 15px;"></div>
        </div>
    `;
    
    // Eventos
    document.getElementById('btn-buscar').addEventListener('click', buscarParaEliminar);
    document.getElementById('buscar-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') buscarParaEliminar();
    });
    document.getElementById('btn-eliminar-final').addEventListener('click', confirmarEliminar);
    document.getElementById('btn-cancelar-busqueda').addEventListener('click', cancelarSeleccionMateria);
}

function buscarParaEliminar() {
    const input = document.getElementById('buscar-input');
    const query = input.value.trim();
    
    if (query.length < 2) {
        mostrarMensaje('Escribe al menos 2 caracteres', 'warning');
        return;
    }
    
    mostrarMensaje('Buscando...', 'info');
    ocultarResultados();
    ocultarSeleccion();
    
    fetch(`${API_BASE_URL}/buscar?nombre=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.materias.length > 0) {
                mostrarResultadosBusqueda(data.materias);
                mostrarMensaje(`Encontradas ${data.materias.length} materias`, 'success');
            } else {
                mostrarMensaje(`No se encontraron materias con "${query}"`, 'warning');
            }
        } else {
            mostrarMensaje(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión', 'error');
    });
}

function mostrarResultadosBusqueda(materias) {
    const container = document.getElementById('resultados-container');
    const lista = document.getElementById('lista-resultados');
    
    lista.innerHTML = '';
    
    materias.forEach(materia => {
        const div = document.createElement('div');
        div.style.padding = '10px';
        div.style.borderBottom = '1px solid #eee';
        div.style.cursor = 'pointer';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${materia.nombre}</strong>
                    <br>
                    <small style="color: #666;">ID: ${materia.id}</small>
                </div>
                <span style="color: #007bff;">
                    <i class="fas fa-chevron-right"></i>
                </span>
            </div>
        `;
        
        div.addEventListener('click', function() {
            seleccionarMateriaParaEliminar(materia);
        });
        
        div.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f8ff';
        });
        
        div.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        lista.appendChild(div);
    });
    
    container.style.display = 'block';
}

function seleccionarMateriaParaEliminar(materia) {
    console.log('Seleccionada para eliminar:', materia);
    
    document.getElementById('selected-id').textContent = materia.id;
    document.getElementById('selected-nombre').textContent = materia.nombre;
    
    document.getElementById('seleccion-container').style.display = 'block';
    document.getElementById('resultados-container').style.display = 'none';
    
    mostrarMensaje('Materia seleccionada. Puedes eliminarla con el botón rojo.', 'info');
}

function confirmarEliminar() {
    const id = document.getElementById('selected-id').textContent;
    const nombre = document.getElementById('selected-nombre').textContent;
    
    if (id === '-' || !id) {
        mostrarMensaje('Primero selecciona una materia', 'warning');
        return;
    }
    
    if (!confirm(`¿ESTÁS SEGURO de eliminar la materia?\n\n"${nombre}"\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    const btn = document.getElementById('btn-eliminar-final');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
    
    fetch(API_BASE_URL + '/eliminar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje(`✅ ${data.message}`, 'success');
            cancelarSeleccionMateria();
            document.getElementById('buscar-input').value = '';
        } else {
            mostrarMensaje(`❌ ${data.message}`, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Error de conexión', 'error');
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
    });
}

function cancelarSeleccionMateria() {
    ocultarSeleccion();
    ocultarResultados();
    document.getElementById('buscar-input').focus();
}

function ocultarResultados() {
    document.getElementById('resultados-container').style.display = 'none';
}

function ocultarSeleccion() {
    document.getElementById('seleccion-container').style.display = 'none';
}

function mostrarMensaje(texto, tipo) {
    const area = document.getElementById('mensaje-area');
    let color = '#333';
    
    switch(tipo) {
        case 'success': color = '#28a745'; break;
        case 'error': color = '#dc3545'; break;
        case 'warning': color = '#ffc107'; break;
        case 'info': color = '#17a2b8'; break;
    }
    
    area.innerHTML = `
        <div style="padding: 10px; background: ${color}15; border-left: 4px solid ${color}; color: ${color};">
            ${texto}
        </div>
    `;
    
    setTimeout(() => {
        if (area.innerHTML.includes(texto)) {
            area.innerHTML = '';
        }
    }, 4000);
}

// Exportar
window.registrarMateria = registrarMateria;