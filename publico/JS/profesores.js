// profesores.js - Sistema completo de gestión de profesores

const API_BASE = '/api/profesores';

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

// Determinar qué página se está cargando
function initPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'Registrar_profesores.html') {
        initRegistro();
    } else if (page === 'Buscar_profesores.html') {
        initBusqueda();
    } else if (page === 'Actualizar_profesores.html') {
        initActualizacion();
    } else if (page === 'Eliminar_profesores.html') {
        initEliminacion();
    }
}

// ===============================
// 1. REGISTRAR PROFESOR
// ===============================
function initRegistro() {
    const form = document.getElementById('formulario-ingresar');
    if (!form) return;
    
    const btnSubmit = form.querySelector('button[onclick="guardarProfesor()"]');
    if (!btnSubmit) return;
    
    btnSubmit.onclick = async function(e) {
        e.preventDefault();
        
        const originalText = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Registrando...';
        
        const numeroControl = document.getElementById('numero_de_control_ingresar').value.trim();
        const nombre = document.getElementById('nombre_ingresar').value.trim();
        const especialidad = document.getElementById('especialidad_ingresar').value.trim();
        
        if (!numeroControl || !nombre || !especialidad) {
            showMessage('mensaje-ingresar', 'Todos los campos son obligatorios', 'error');
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
            return;
        }
        
        const data = {
            numero_de_control: numeroControl,
            nombre: nombre,
            especialidad: especialidad
        };
        
        try {
            const response = await fetch(`${API_BASE}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            showMessage('mensaje-ingresar', result.message, result.status);
            
            if (result.status === 'success') {
                form.reset();
            }
        } catch (error) {
            showMessage('mensaje-ingresar', 'Error de conexión', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    };
}

// ===============================
// 2. BUSCAR PROFESOR
// ===============================
function initBusqueda() {
    const btnBuscar = document.getElementById('btn-buscar') || document.querySelector('button[onclick*="buscar"]');
    if (!btnBuscar) return;
    
    btnBuscar.onclick = async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('busqueda-numero').value.trim();
        const resultadosDiv = document.getElementById('resultados-busqueda');
        const datosDiv = document.getElementById('datos-profesor');
        
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
                showMessage('mensaje-busqueda', 'Profesor encontrado', 'success');
                displayProfesorData(datosDiv, result);
                
                if (resultadosDiv) resultadosDiv.style.display = 'block';
                if (datosDiv) datosDiv.style.display = 'block';
            }
        } catch (error) {
            showMessage('mensaje-busqueda', 'Error de conexión', 'error');
        }
    };
}

// ===============================
// 3. ACTUALIZAR PROFESOR
// ===============================
function initActualizacion() {
    const btnBuscar = document.getElementById('btn-buscar-actualizar') || document.querySelector('button[onclick*="buscar"]');
    const formActualizar = document.getElementById('formulario-actualizar');
    
    if (!btnBuscar || !formActualizar) return;
    
    btnBuscar.onclick = async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('actualizar-numero').value.trim();
        
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
                showMessage('mensaje-actualizar', 'Profesor encontrado', 'success');
                fillUpdateForm(result);
                formActualizar.style.display = 'block';
            }
        } catch (error) {
            showMessage('mensaje-actualizar', 'Error de conexión', 'error');
        }
    };
    
    const btnActualizar = formActualizar.querySelector('button[onclick="actualizarProfesor()"]');
    if (btnActualizar) {
        btnActualizar.onclick = async function(e) {
            e.preventDefault();
            
            const originalText = btnActualizar.textContent;
            btnActualizar.disabled = true;
            btnActualizar.textContent = 'Actualizando...';
            
            const numeroOriginal = document.getElementById('numero_original').value;
            const nombre = document.getElementById('nombre_actualizar').value.trim();
            const especialidad = document.getElementById('especialidad_actualizar').value.trim();
            
            if (!numeroOriginal || !nombre || !especialidad) {
                showMessage('mensaje-actualizar', 'Todos los campos son obligatorios', 'error');
                btnActualizar.disabled = false;
                btnActualizar.textContent = originalText;
                return;
            }
            
            const data = {
                numero_de_control: numeroOriginal,
                nombre: nombre,
                especialidad: especialidad
            };
            
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
                        formActualizar.reset();
                        document.getElementById('actualizar-numero').value = '';
                    }, 2000);
                }
            } catch (error) {
                showMessage('mensaje-actualizar', 'Error de conexión', 'error');
            } finally {
                btnActualizar.disabled = false;
                btnActualizar.textContent = originalText;
            }
        };
    }
}

// ===============================
// 4. ELIMINAR PROFESOR
// ===============================
function initEliminacion() {
    const btnBuscar = document.getElementById('btn-buscar-eliminar') || document.querySelector('button[onclick*="buscar"]');
    if (!btnBuscar) return;
    
    btnBuscar.onclick = async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('eliminar-numero').value.trim();
        const datosDiv = document.getElementById('datos-profesor');
        const infoDiv = document.getElementById('info-profesor');
        const confirmarBtn = document.getElementById('btn-eliminar-confirmar');
        
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
                    datosDiv.style.display = 'none';
                }
                if (confirmarBtn) {
                    confirmarBtn.style.display = 'none';
                }
                return;
            }
            
            showMessage('mensaje-eliminar', 'Profesor encontrado', 'info');
            displayProfesorDataWithDeleteButton(infoDiv, result, numeroControl);
            
            if (datosDiv) datosDiv.style.display = 'block';
            if (confirmarBtn) confirmarBtn.style.display = 'block';
            
        } catch (error) {
            showMessage('mensaje-eliminar', 'Error de conexión', 'error');
        }
    };
    
    const btnConfirmar = document.getElementById('btn-eliminar-confirmar');
    if (btnConfirmar) {
        btnConfirmar.onclick = async function(e) {
            e.preventDefault();
            
            const numeroControl = document.getElementById('eliminar-numero').value.trim();
            
            if (!numeroControl) {
                showMessage('mensaje-eliminar', 'Ingrese un número de control', 'error');
                return;
            }
            
            const originalText = btnConfirmar.textContent;
            btnConfirmar.disabled = true;
            btnConfirmar.textContent = 'Eliminando...';
            
            try {
                const deleteResponse = await fetch(`${API_BASE}/eliminar`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ numero_de_control: numeroControl })
                });
                
                const result = await deleteResponse.json();
                showMessage('mensaje-eliminar', result.message, result.status);
                
                if (result.status === 'success') {
                    const form = document.getElementById('eliminar-numero');
                    if (form) form.value = '';
                    
                    const datosDiv = document.getElementById('datos-profesor');
                    if (datosDiv) {
                        datosDiv.style.display = 'none';
                    }
                    
                    if (btnConfirmar) {
                        btnConfirmar.style.display = 'none';
                    }
                    
                    const infoDiv = document.getElementById('info-profesor');
                    if (infoDiv) {
                        infoDiv.innerHTML = '';
                    }
                }
            } catch (error) {
                showMessage('mensaje-eliminar', 'Error al eliminar', 'error');
            } finally {
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = originalText;
            }
        };
    }
}

// ===============================
// FUNCIONES AUXILIARES
// ===============================

// Mostrar datos del profesor
function displayProfesorData(container, profesor) {
    if (!container) return;
    
    let html = '<div><h4>Datos del Profesor:</h4>';
    html += '<p><b>Número de Control:</b> ' + (profesor.numero_de_control || 'No especificado') + '</p>';
    html += '<p><b>Nombre:</b> ' + (profesor.nombre || 'No especificado') + '</p>';
    html += '<p><b>Especialidad:</b> ' + (profesor.especialidad || 'No especificado') + '</p>';
    html += '</div>';
    
    container.innerHTML = html;
}

// Mostrar datos con botón eliminar
function displayProfesorDataWithDeleteButton(container, profesor, numeroControl) {
    if (!container) return;
    
    let html = '<div><h4>Datos del Profesor a Eliminar:</h4>';
    html += '<p><b>Número de Control:</b> ' + (profesor.numero_de_control || 'No especificado') + '</p>';
    html += '<p><b>Nombre:</b> ' + (profesor.nombre || 'No especificado') + '</p>';
    html += '<p><b>Especialidad:</b> ' + (profesor.especialidad || 'No especificado') + '</p>';
    html += '</div>';
    
    container.innerHTML = html;
}

// Llenar formulario de actualización
function fillUpdateForm(profesor) {
    const controlHidden = document.getElementById('numero_original');
    if (controlHidden) {
        controlHidden.value = profesor.numero_de_control || '';
    }
    
    const nombreInput = document.getElementById('nombre_actualizar');
    if (nombreInput) {
        nombreInput.value = profesor.nombre || '';
    }
    
    const especialidadInput = document.getElementById('especialidad_actualizar');
    if (especialidadInput) {
        especialidadInput.value = profesor.especialidad || '';
    }
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

// Hacer funciones globales para compatibilidad con onclick
window.guardarProfesor = async function() {
    const form = document.getElementById('formulario-ingresar');
    if (!form) return;
    
    const btnSubmit = form.querySelector('button[onclick="guardarProfesor()"]');
    if (btnSubmit) btnSubmit.click();
};

window.buscarProfesor = async function() {
    const btnBuscar = document.getElementById('btn-buscar') || document.querySelector('button[onclick="buscarProfesor()"]');
    if (btnBuscar) btnBuscar.click();
};

window.buscarProfesorEliminar = async function() {
    const btnBuscar = document.getElementById('btn-buscar-eliminar') || document.querySelector('button[onclick="buscarProfesorEliminar()"]');
    if (btnBuscar) btnBuscar.click();
};

window.eliminarProfesorConfirmado = async function() {
    const btnConfirmar = document.getElementById('btn-eliminar-confirmar');
    if (btnConfirmar) btnConfirmar.click();
};

window.buscarProfesorActualizar = async function() {
    const btnBuscar = document.getElementById('btn-buscar-actualizar') || document.querySelector('button[onclick="buscarProfesorActualizar()"]');
    if (btnBuscar) btnBuscar.click();
};

window.actualizarProfesor = async function() {
    const btnActualizar = document.querySelector('button[onclick="actualizarProfesor()"]');
    if (btnActualizar) btnActualizar.click();
};