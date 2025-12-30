// alumnos.js - Sistema completo de gestión de alumnos

const API_BASE = '/api/alumnos';

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

// Determinar qué página se está cargando
function initPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'Ingresar_Alumno_admin.html') {
        initRegistro();
    } else if (page === 'Buscar_alumno_admin.html') {
        initBusqueda();
    } else if (page === 'Actualizar_alumno_admin.html') {
        initActualizacion();
    } else if (page === 'Borrar_alumno_admin.html') {
        initEliminacion();
    }
}

// ===============================
// 1. REGISTRAR ALUMNO
// ===============================
function initRegistro() {
    const form = document.getElementById('formulario-registro');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Registrando...';
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_BASE}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            showMessage('mensaje-registro', result.message, result.status);
            
            if (result.status === 'success') {
                form.reset();
            }
        } catch (error) {
            showMessage('mensaje-registro', 'Error de conexión con el servidor', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    });
}

// ===============================
// 2. BUSCAR ALUMNO - CORREGIDO
// ===============================
function initBusqueda() {
    const form = document.getElementById('formulario-buscar');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        const resultadosDiv = document.getElementById('resultados-busqueda');
        const datosDiv = document.getElementById('datos-alumno');
        
        if (!numeroControl) {
            showMessage('mensaje-busqueda', 'Ingrese un número de control', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/buscar/${numeroControl}`);
            const result = await response.json();
            
            // Verificar si es un error o datos del alumno
            if (result.status === 'error') {
                showMessage('mensaje-busqueda', result.message, 'error');
                if (resultadosDiv) resultadosDiv.style.display = 'none';
                if (datosDiv) {
                    datosDiv.innerHTML = '';
                    datosDiv.style.display = 'none';
                }
            } else {
                showMessage('mensaje-busqueda', 'Alumno encontrado', 'success');
                
                // Mostrar datos del alumno
                displayAlumnoData(datosDiv, result);
                
                // Mostrar contenedor de resultados
                if (resultadosDiv) {
                    resultadosDiv.style.display = 'block';
                }
                
                if (datosDiv) datosDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
            showMessage('mensaje-busqueda', 'Error de conexión con el servidor', 'error');
        }
    });
}

// ===============================
// 3. ACTUALIZAR ALUMNO
// ===============================
function initActualizacion() {
    const formBuscar = document.getElementById('formulario-buscar');
    const formActualizar = document.getElementById('formulario-actualizar');
    
    if (!formBuscar || !formActualizar) return;
    
    // Buscar alumno para actualizar
    formBuscar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        
        if (!numeroControl) {
            showMessage('mensaje-actualizar', 'Ingrese un número de control', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/buscar/${numeroControl}`);
            const result = await response.json();
            
            if (result.status === 'error') {
                showMessage('mensaje-actualizar', result.message, 'error');
                formActualizar.style.display = 'none';
            } else {
                showMessage('mensaje-actualizar', 'Alumno encontrado. Modifique los datos.', 'success');
                fillUpdateForm(result);
                formActualizar.style.display = 'block';
            }
        } catch (error) {
            showMessage('mensaje-actualizar', 'Error de conexión con el servidor', 'error');
        }
    });
    
    // Actualizar datos del alumno
    formActualizar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnSubmit = formActualizar.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Actualizando...';
        
        const formData = new FormData(formActualizar);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_BASE}/actualizar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            showMessage('mensaje-actualizar', result.message, result.status);
            
            if (result.status === 'success') {
                setTimeout(() => {
                    formActualizar.style.display = 'none';
                    formBuscar.reset();
                }, 2000);
            }
        } catch (error) {
            showMessage('mensaje-actualizar', 'Error de conexión con el servidor', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    });
}

// ===============================
// 4. ELIMINAR ALUMNO - CORREGIDO
// ===============================
function initEliminacion() {
    const form = document.getElementById('formulario-eliminar');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        const datosDiv = document.getElementById('datos-alumno');
        
        if (!numeroControl) {
            showMessage('mensaje-eliminar', 'Ingrese un número de control', 'error');
            return;
        }
        
        try {
            // Buscar alumno primero
            const searchResponse = await fetch(`${API_BASE}/buscar/${numeroControl}`);
            const result = await searchResponse.json();
            
            if (result.status === 'error') {
                showMessage('mensaje-eliminar', result.message, 'error');
                if (datosDiv) {
                    datosDiv.innerHTML = '';
                    datosDiv.style.display = 'none';
                }
                return;
            }
            
            // Mostrar datos con botones de acción
            showMessage('mensaje-eliminar', 'Alumno encontrado. Revise los datos y confirme la eliminación.', 'info');
            displayAlumnoDataWithDeleteButton(datosDiv, result, numeroControl);
            
            if (datosDiv) datosDiv.style.display = 'block';
            
        } catch (error) {
            console.error('Error en búsqueda para eliminar:', error);
            showMessage('mensaje-eliminar', 'Error de conexión con el servidor', 'error');
        }
    });
}

// ===============================
// FUNCIONES AUXILIARES
// ===============================

// Mostrar datos del alumno (para búsqueda)
function displayAlumnoData(container, alumno) {
    if (!container) return;
    
    const html = `
        <div class="alumno-info-card" style="border: 1px solid #3498db; padding: 20px; border-radius: 8px; margin-top: 15px; background-color: #f8f9fa;">
            <h3 style="color: #3498db; margin-top: 0;">Información del Alumno</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                <div>
                    <p><strong>Número de Control:</strong><br>${alumno.numero_de_control || 'No especificado'}</p>
                    <p><strong>Nombre:</strong><br>${alumno.nombre || 'No especificado'}</p>
                    <p><strong>Fecha Nacimiento:</strong><br>${alumno.fecha_nacimiento || 'No especificado'}</p>
                    <p><strong>Curso:</strong><br>${alumno.curso || 'No especificado'}</p>
                    <p><strong>CURP:</strong><br>${alumno.curp || 'No especificado'}</p>
                </div>
                
                <div>
                    <p><strong>Email:</strong><br>${alumno.email || 'No especificado'}</p>
                    <p><strong>Teléfono:</strong><br>${alumno.telefonos || 'No especificado'}</p>
                    <p><strong>Dirección:</strong><br>${alumno.direccion || 'No especificado'}</p>
                    <p><strong>Población:</strong><br>${alumno.poblacion || 'No especificado'}</p>
                    <p><strong>Estatus:</strong><br><span style="color: ${alumno.estatus === 'activo' ? '#27ae60' : '#e74c3c'}">${alumno.estatus || 'No especificado'}</span></p>
                </div>
            </div>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                <h4 style="color: #2c3e50;">Información Adicional</h4>
                ${alumno.alergico ? `<p><strong>Alergias:</strong> ${alumno.alergico}</p>` : ''}
                ${alumno.contacto_accidente ? `<p><strong>Contacto Emergencia:</strong> ${alumno.contacto_accidente}</p>` : ''}
                ${alumno.telefonos_contacto ? `<p><strong>Teléfonos Contacto:</strong> ${alumno.telefonos_contacto}</p>` : ''}
                ${alumno.nombre_autorizado ? `<p><strong>Nombre Autorizado:</strong> ${alumno.nombre_autorizado}</p>` : ''}
                ${alumno.curp_autorizado ? `<p><strong>CURP Autorizado:</strong> ${alumno.curp_autorizado}</p>` : ''}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Mostrar datos con botón eliminar (para eliminación)
function displayAlumnoDataWithDeleteButton(container, alumno, numeroControl) {
    if (!container) return;
    
    const html = `
        <div class="alumno-info-card" style="border: 2px solid #e74c3c; padding: 20px; border-radius: 8px; margin-top: 15px; background-color: #fff5f5;">
            <h3 style="color: #e74c3c; margin-top: 0;">Alumno Encontrado - Confirmar Eliminación</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                <div>
                    <p><strong>Número de Control:</strong><br>${alumno.numero_de_control || 'No especificado'}</p>
                    <p><strong>Nombre:</strong><br>${alumno.nombre || 'No especificado'}</p>
                    <p><strong>Fecha Nacimiento:</strong><br>${alumno.fecha_nacimiento || 'No especificado'}</p>
                    <p><strong>Curso:</strong><br>${alumno.curso || 'No especificado'}</p>
                    <p><strong>CURP:</strong><br>${alumno.curp || 'No especificado'}</p>
                </div>
                
                <div>
                    <p><strong>Email:</strong><br>${alumno.email || 'No especificado'}</p>
                    <p><strong>Teléfono:</strong><br>${alumno.telefonos || 'No especificado'}</p>
                    <p><strong>Dirección:</strong><br>${alumno.direccion || 'No especificado'}</p>
                    <p><strong>Población:</strong><br>${alumno.poblacion || 'No especificado'}</p>
                    <p><strong>Estatus:</strong><br>${alumno.estatus || 'No especificado'}</p>
                </div>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background-color: #ffeaea; border-radius: 6px; border: 1px solid #f5c6cb;">
                <h4 style="color: #721c24; margin-top: 0;">⚠️ ADVERTENCIA: Esta acción no se puede deshacer</h4>
                <p style="color: #721c24;">¿Está completamente seguro de eliminar permanentemente a este alumno del sistema?</p>
                
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button id="btn-confirmar-eliminar" 
                            class="btn btn-danger" 
                            style="padding: 12px 24px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; flex: 1;">
                        <i class="fas fa-trash-alt"></i> Sí, Eliminar Permanentemente
                    </button>
                    
                    <button id="btn-cancelar-eliminar" 
                            class="btn btn-secondary" 
                            style="padding: 12px 24px; background-color: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;">
                        <i class="fas fa-times"></i> Cancelar Eliminación
                    </button>
                </div>
                
                <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
                    <i class="fas fa-exclamation-triangle"></i> Todos los datos del alumno serán eliminados permanentemente y no podrán recuperarse.
                </p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Configurar eventos de los botones
    const btnConfirmar = document.getElementById('btn-confirmar-eliminar');
    const btnCancelar = document.getElementById('btn-cancelar-eliminar');
    
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', async function() {
            try {
                const deleteResponse = await fetch(`${API_BASE}/eliminar`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ numero_de_control: numeroControl })
                });
                
                const result = await deleteResponse.json();
                showMessage('mensaje-eliminar', result.message, result.status);
                
                if (result.status === 'success') {
                    // Limpiar todo después de eliminar
                    const form = document.getElementById('formulario-eliminar');
                    if (form) form.reset();
                    
                    if (container) {
                        container.innerHTML = '';
                        container.style.display = 'none';
                    }
                    
                    // Ocultar mensaje después de 3 segundos
                    setTimeout(() => {
                        const msg = document.getElementById('mensaje-eliminar');
                        if (msg) msg.style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error al eliminar:', error);
                showMessage('mensaje-eliminar', 'Error al eliminar el alumno', 'error');
            }
        });
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            if (container) {
                container.innerHTML = '';
                container.style.display = 'none';
            }
            showMessage('mensaje-eliminar', 'Eliminación cancelada', 'info');
        });
    }
}

// Llenar formulario de actualización
function fillUpdateForm(alumno) {
    // Campo oculto para el número de control
    const controlHidden = document.getElementById('numero_de_control_actualizar');
    if (controlHidden) {
        controlHidden.value = alumno.numero_de_control || '';
    }
    
    // Llenar todos los campos del formulario
    const campos = [
        'nombre', 'fecha_nacimiento', 'curso', 'poblacion',
        'direccion', 'email', 'telefonos', 'curp', 'estatus',
        'alergico', 'contacto_accidente', 'telefonos_contacto',
        'nombre_autorizado', 'curp_autorizado'
    ];
    
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        if (input && alumno[campo] !== undefined) {
            input.value = alumno[campo] || '';
        }
    });
}

// Mostrar mensajes en pantalla
function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = text;
    element.className = `mensaje mensaje-${type}`;
    element.style.display = 'block';
    
    // Configurar colores según el tipo de mensaje
    if (type === 'success') {
        element.style.backgroundColor = '#d4edda';
        element.style.color = '#155724';
        element.style.borderColor = '#c3e6cb';
    } else if (type === 'error') {
        element.style.backgroundColor = '#f8d7da';
        element.style.color = '#721c24';
        element.style.borderColor = '#f5c6cb';
    } else if (type === 'info') {
        element.style.backgroundColor = '#d1ecf1';
        element.style.color = '#0c5460';
        element.style.borderColor = '#bee5eb';
    }
    
    // Auto-ocultar mensajes de éxito/info después de tiempo
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Verificar conexión con el servidor (opcional)
async function checkServerConnection() {
    try {
        const response = await fetch(`${API_BASE}/listar`);
        return response.ok;
    } catch (error) {
        console.warn('No se pudo conectar con el servidor:', error);
        return false;
    }
}