// publico/JS/materias.js

const API_BASE_URL = '/api/materias';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Materias JS cargado');
    
    // ===== FORMULARIO DE REGISTRO =====
    const formRegistro = document.getElementById('formulario-ingresar');
    if (formRegistro) {
        console.log('Formulario de registro encontrado');
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarMateria();
        });
    }
    
    // ===== INICIALIZAR BÚSQUEDA SI ESTAMOS EN PÁGINA DE ELIMINAR =====
    if (window.location.pathname.includes('eliminar')) {
        console.log('Página de eliminación detectada');
        inicializarBusquedaParaEliminar();
    }
});

// ========== REGISTRAR MATERIA - SIMPLIFICADA ==========
function registrarMateria() {
    const inputNombre = document.getElementById('materia-nombre');
    const btnGuardar = document.querySelector('#formulario-ingresar button[type="submit"]');
    
    if (!inputNombre || !btnGuardar) {
        alert('Error: Elementos del formulario no encontrados');
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
    
    // Datos a enviar
    const datos = { nombre: nombre };
    
    console.log('Enviando:', datos);
    
    // Enviar petición
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
            alert('✅ ' + data.message);
            inputNombre.value = ''; // Limpiar campo
            
            // Si estamos en página de eliminar, limpiar búsqueda
            if (window.location.pathname.includes('eliminar')) {
                const busquedaInput = document.getElementById('busqueda-nombre');
                if (busquedaInput) busquedaInput.value = '';
                document.getElementById('resultados-busqueda')?.style?.display = 'none';
                document.getElementById('info-materia')?.style?.display = 'none';
            }
        } else {
            alert('❌ ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('⚠️ Error de conexión. Verifica si la materia se registró.');
    })
    .finally(() => {
        // SIEMPSE RESTAURAR EL BOTÓN
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
    });
}

// ========== SISTEMA DE BÚSQUEDA PARA ELIMINAR ==========
function inicializarBusquedaParaEliminar() {
    console.log('Inicializando sistema de búsqueda...');
    
    // Crear interfaz de búsqueda si no existe
    let busquedaContainer = document.getElementById('busqueda-container');
    if (!busquedaContainer) {
        // Buscar un lugar donde insertar
        const mainContainer = document.querySelector('.container, main, .contenedor') || document.body;
        
        // Crear contenedor
        busquedaContainer = document.createElement('div');
        busquedaContainer.id = 'busqueda-container';
        busquedaContainer.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
                <h3 style="margin-bottom: 20px; color: #333;">
                    <i class="fas fa-search"></i> Buscar Materia para Eliminar
                </h3>
                
                <!-- Campo de búsqueda -->
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" 
                               id="busqueda-nombre" 
                               placeholder="Escribe el nombre de la materia..."
                               style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"
                               autocomplete="off">
                        <button id="btn-buscar" 
                                style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-search"></i> Buscar
                        </button>
                    </div>
                    <small style="color: #666; display: block; margin-top: 5px;">
                        Escribe al menos 2 caracteres
                    </small>
                </div>
                
                <!-- Resultados -->
                <div id="resultados-busqueda" style="display: none; margin-top: 20px;">
                    <h5>Resultados:</h5>
                    <div id="lista-resultados" style="border: 1px solid #ddd; border-radius: 4px; max-height: 300px; overflow-y: auto;"></div>
                </div>
                
                <!-- Materia seleccionada -->
                <div id="info-materia" style="display: none; margin-top: 30px; padding: 20px; border: 2px solid #28a745; border-radius: 8px; background: #f8fff9;">
                    <h5 style="color: #28a745; margin-bottom: 15px;">
                        <i class="fas fa-check-circle"></i> Materia Seleccionada
                    </h5>
                    <div style="margin-bottom: 20px;">
                        <p><strong>ID:</strong> <span id="materia-id">-</span></p>
                        <p><strong>Nombre:</strong> <span id="materia-nombre-text">-</span></p>
                    </div>
                    <div style="text-align: center;">
                        <button id="btn-eliminar" 
                                style="padding: 12px 30px; background: #dc3545; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">
                            <i class="fas fa-trash"></i> ELIMINAR MATERIA
                        </button>
                        <button id="btn-cancelar" 
                                style="padding: 12px 30px; background: #6c757d; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; margin-left: 10px;">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </div>
                
                <!-- Mensajes -->
                <div id="mensaje" style="margin-top: 10px;"></div>
            </div>
        `;
        
        mainContainer.prepend(busquedaContainer);
        
        // Agregar eventos
        document.getElementById('btn-buscar').addEventListener('click', buscarMaterias);
        document.getElementById('busqueda-nombre').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') buscarMaterias();
        });
        document.getElementById('btn-eliminar').addEventListener('click', confirmarEliminacion);
        document.getElementById('btn-cancelar').addEventListener('click', cancelarSeleccion);
    }
}

function buscarMaterias() {
    const input = document.getElementById('busqueda-nombre');
    const query = input.value.trim();
    
    if (query.length < 2) {
        mostrarMensaje('Escribe al menos 2 caracteres', 'warning');
        return;
    }
    
    mostrarMensaje('Buscando...', 'info');
    
    fetch(`${API_BASE_URL}/buscar?nombre=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarResultados(data.materias);
            if (data.materias.length === 0) {
                mostrarMensaje(`No se encontraron materias con "${query}"`, 'warning');
            } else {
                mostrarMensaje(`Encontradas ${data.materias.length} materias`, 'success');
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

function mostrarResultados(materias) {
    const resultadosDiv = document.getElementById('resultados-busqueda');
    const lista = document.getElementById('lista-resultados');
    
    lista.innerHTML = '';
    
    if (!materias || materias.length === 0) {
        resultadosDiv.style.display = 'none';
        return;
    }
    
    materias.forEach(materia => {
        const item = document.createElement('div');
        item.style.padding = '10px';
        item.style.borderBottom = '1px solid #eee';
        item.style.cursor = 'pointer';
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${materia.nombre}</strong><br>
                    <small style="color: #666;">ID: ${materia.id}</small>
                </div>
                <span style="color: #28a745; font-size: 12px;">
                    <i class="fas fa-chevron-right"></i>
                </span>
            </div>
        `;
        
        item.addEventListener('click', function() {
            seleccionarMateria(materia);
        });
        
        // Efecto hover
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f5f5';
        });
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        lista.appendChild(item);
    });
    
    resultadosDiv.style.display = 'block';
}

function seleccionarMateria(materia) {
    console.log('Seleccionada:', materia);
    
    // Mostrar información
    document.getElementById('materia-id').textContent = materia.id;
    document.getElementById('materia-nombre-text').textContent = materia.nombre;
    document.getElementById('info-materia').style.display = 'block';
    
    // Ocultar resultados
    document.getElementById('resultados-busqueda').style.display = 'none';
    
    // Desplazar vista
    document.getElementById('info-materia').scrollIntoView({ behavior: 'smooth' });
    
    mostrarMensaje('Materia seleccionada. Haz clic en ELIMINAR MATERIA para continuar.', 'info');
}

function confirmarEliminacion() {
    const id = document.getElementById('materia-id').textContent;
    const nombre = document.getElementById('materia-nombre-text').textContent;
    
    if (id === '-' || !id) {
        mostrarMensaje('Primero selecciona una materia', 'warning');
        return;
    }
    
    if (!confirm(`¿ESTÁS SEGURO de eliminar la materia?\n\n"${nombre}"\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    const btnEliminar = document.getElementById('btn-eliminar');
    const originalText = btnEliminar.innerHTML;
    btnEliminar.disabled = true;
    btnEliminar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
    
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
            mostrarMensaje(`✅ ${data.message}`, 'success');
            cancelarSeleccion();
            document.getElementById('busqueda-nombre').value = '';
        } else {
            mostrarMensaje(`❌ ${data.message}`, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Error de conexión', 'error');
    })
    .finally(() => {
        btnEliminar.disabled = false;
        btnEliminar.innerHTML = originalText;
    });
}

function cancelarSeleccion() {
    document.getElementById('info-materia').style.display = 'none';
    document.getElementById('materia-id').textContent = '-';
    document.getElementById('materia-nombre-text').textContent = '-';
    document.getElementById('resultados-busqueda').style.display = 'none';
    document.getElementById('busqueda-nombre').focus();
}

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    let color = '#333';
    let icon = '';
    
    switch(tipo) {
        case 'success': color = '#28a745'; icon = '✅'; break;
        case 'error': color = '#dc3545'; icon = '❌'; break;
        case 'warning': color = '#ffc107'; icon = '⚠️'; break;
        case 'info': color = '#17a2b8'; icon = 'ℹ️'; break;
    }
    
    mensajeDiv.innerHTML = `<div style="padding: 10px; background: ${color}15; border-left: 4px solid ${color}; color: ${color};">
        ${icon} ${texto}
    </div>`;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (mensajeDiv.innerHTML.includes(texto)) {
            mensajeDiv.innerHTML = '';
        }
    }, 5000);
}