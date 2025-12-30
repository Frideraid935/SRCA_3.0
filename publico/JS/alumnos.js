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
            showMessage('mensaje-registro', 'Error de conexión', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    });
}

// ===============================
// 2. BUSCAR ALUMNO
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
            
            if (result.status === 'error') {
                showMessage('mensaje-busqueda', result.message, 'error');
                if (resultadosDiv) resultadosDiv.style.display = 'none';
                if (datosDiv) {
                    datosDiv.innerHTML = '';
                    datosDiv.style.display = 'none';
                }
            } else {
                showMessage('mensaje-busqueda', 'Alumno encontrado', 'success');
                displayAlumnoDataSimple(datosDiv, result);
                
                if (resultadosDiv) resultadosDiv.style.display = 'block';
                if (datosDiv) datosDiv.style.display = 'block';
            }
        } catch (error) {
            showMessage('mensaje-busqueda', 'Error de conexión', 'error');
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
                showMessage('mensaje-actualizar', 'Alumno encontrado', 'success');
                fillUpdateForm(result);
                formActualizar.style.display = 'block';
            }
        } catch (error) {
            showMessage('mensaje-actualizar', 'Error de conexión', 'error');
        }
    });
    
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
            showMessage('mensaje-actualizar', 'Error de conexión', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    });
}

// ===============================
// 4. ELIMINAR ALUMNO
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
            
            showMessage('mensaje-eliminar', 'Alumno encontrado', 'info');
            displayAlumnoDataWithDeleteButton(datosDiv, result, numeroControl);
            
            if (datosDiv) datosDiv.style.display = 'block';
            
        } catch (error) {
            showMessage('mensaje-eliminar', 'Error de conexión', 'error');
        }
    });
}

// ===============================
// FUNCIONES AUXILIARES
// ===============================

// Mostrar datos del alumno (formato simple para búsqueda)
function displayAlumnoDataSimple(container, alumno) {
    if (!container) return;
    
    let html = '<div><h4>Datos del Alumno:</h4>';
    
    // Información básica
    html += '<p><b>Número de Control:</b> ' + (alumno.numero_de_control || 'No especificado') + '</p>';
    html += '<p><b>Nombre:</b> ' + (alumno.nombre || 'No especificado') + '</p>';
    html += '<p><b>Fecha Nacimiento:</b> ' + (alumno.fecha_nacimiento || 'No especificado') + '</p>';
    html += '<p><b>Curso:</b> ' + (alumno.curso || 'No especificado') + '</p>';
    html += '<p><b>CURP:</b> ' + (alumno.curp || 'No especificado') + '</p>';
    html += '<p><b>Email:</b> ' + (alumno.email || 'No especificado') + '</p>';
    html += '<p><b>Teléfono:</b> ' + (alumno.telefonos || 'No especificado') + '</p>';
    html += '<p><b>Dirección:</b> ' + (alumno.direccion || 'No especificado') + '</p>';
    html += '<p><b>Población:</b> ' + (alumno.poblacion || 'No especificado') + '</p>';
    html += '<p><b>Estatus:</b> ' + (alumno.estatus || 'No especificado') + '</p>';
    
    // Información adicional si existe
    if (alumno.alergico) {
        html += '<p><b>Alergias:</b> ' + alumno.alergico + '</p>';
    }
    if (alumno.contacto_accidente) {
        html += '<p><b>Contacto Emergencia:</b> ' + alumno.contacto_accidente + '</p>';
    }
    if (alumno.telefonos_contacto) {
        html += '<p><b>Teléfonos Contacto:</b> ' + alumno.telefonos_contacto + '</p>';
    }
    if (alumno.nombre_autorizado) {
        html += '<p><b>Nombre Autorizado:</b> ' + alumno.nombre_autorizado + '</p>';
    }
    if (alumno.curp_autorizado) {
        html += '<p><b>CURP Autorizado:</b> ' + alumno.curp_autorizado + '</p>';
    }
    
    html += '</div>';
    
    container.innerHTML = html;
}

// Mostrar datos con botón eliminar
function displayAlumnoDataWithDeleteButton(container, alumno, numeroControl) {
    if (!container) return;
    
    let html = '<div><h4>Datos del Alumno a Eliminar:</h4>';
    
    // Información básica
    html += '<p><b>Número de Control:</b> ' + (alumno.numero_de_control || 'No especificado') + '</p>';
    html += '<p><b>Nombre:</b> ' + (alumno.nombre || 'No especificado') + '</p>';
    html += '<p><b>Fecha Nacimiento:</b> ' + (alumno.fecha_nacimiento || 'No especificado') + '</p>';
    html += '<p><b>Curso:</b> ' + (alumno.curso || 'No especificado') + '</p>';
    html += '<p><b>CURP:</b> ' + (alumno.curp || 'No especificado') + '</p>';
    html += '<p><b>Email:</b> ' + (alumno.email || 'No especificado') + '</p>';
    html += '<p><b>Teléfono:</b> ' + (alumno.telefonos || 'No especificado') + '</p>';
    html += '<p><b>Dirección:</b> ' + (alumno.direccion || 'No especificado') + '</p>';
    html += '<p><b>Población:</b> ' + (alumno.poblacion || 'No especificado') + '</p>';
    html += '<p><b>Estatus:</b> ' + (alumno.estatus || 'No especificado') + '</p>';
    
    // Información adicional si existe
    if (alumno.alergico) {
        html += '<p><b>Alergias:</b> ' + alumno.alergico + '</p>';
    }
    if (alumno.contacto_accidente) {
        html += '<p><b>Contacto Emergencia:</b> ' + alumno.contacto_accidente + '</p>';
    }
    if (alumno.telefonos_contacto) {
        html += '<p><b>Teléfonos Contacto:</b> ' + alumno.telefonos_contacto + '</p>';
    }
    if (alumno.nombre_autorizado) {
        html += '<p><b>Nombre Autorizado:</b> ' + alumno.nombre_autorizado + '</p>';
    }
    if (alumno.curp_autorizado) {
        html += '<p><b>CURP Autorizado:</b> ' + alumno.curp_autorizado + '</p>';
    }
    
    // Botones de acción
    html += '<div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 15px;">';
    html += '<p><b>¿Eliminar este alumno?</b></p>';
    html += '<button id="btn-confirmar-eliminar" style="padding: 8px 16px; background: #dc3545; color: white; border: none; margin-right: 10px; cursor: pointer;">Eliminar</button>';
    html += '<button id="btn-cancelar-eliminar" style="padding: 8px 16px; background: #6c757d; color: white; border: none; cursor: pointer;">Cancelar</button>';
    html += '</div></div>';
    
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
                    const form = document.getElementById('formulario-eliminar');
                    if (form) form.reset();
                    
                    if (container) {
                        container.innerHTML = '';
                        container.style.display = 'none';
                    }
                    
                    setTimeout(() => {
                        const msg = document.getElementById('mensaje-eliminar');
                        if (msg) msg.style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                showMessage('mensaje-eliminar', 'Error al eliminar', 'error');
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
    const controlHidden = document.getElementById('numero_de_control_actualizar');
    if (controlHidden) {
        controlHidden.value = alumno.numero_de_control || '';
    }
    
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
    
    // Auto-ocultar mensajes después de tiempo
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}