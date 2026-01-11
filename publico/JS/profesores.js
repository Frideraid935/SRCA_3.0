// profesores.js - VERSIÓN CORREGIDA
const API_BASE = '/api/profesores';

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

function initPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    console.log('Página detectada:', page);
    
    if (page.includes('Registrar_profesores')) {
        initRegistro();
    } else if (page.includes('Buscar_profesores')) {
        initBusqueda();
    } else if (page.includes('Actualizar_profesores')) {
        initActualizacion();
    } else if (page.includes('Eliminar_profesores')) {
        initEliminacion();
    }
}

function initRegistro() {
    const form = document.getElementById('formulario-ingresar');
    console.log('Formulario registro:', form);
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // ESTA LÍNEA ES CRÍTICA
        console.log('Formulario registro enviado');
        
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Registrando...';
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Datos a enviar:', data);
        
        try {
            const response = await fetch(`${API_BASE}/registrar`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            console.log('Respuesta status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Resultado:', result);
            
            showMessage('mensaje-ingresar', result.message, result.status);
            
            if (result.status === 'success') {
                form.reset();
            }
        } catch (error) {
            console.error('Error completo:', error);
            showMessage('mensaje-ingresar', 'Error de conexión: ' + error.message, 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    });
}

function initBusqueda() {
    const form = document.getElementById('formulario-buscar');
    console.log('Formulario búsqueda:', form);
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // PREVENIR ENVÍO POR GET
        
        const numeroControl = document.getElementById('busqueda-numero').value.trim();
        const resultadosDiv = document.getElementById('resultados-busqueda');
        const datosDiv = document.getElementById('datos-profesor');
        
        console.log('Buscando:', numeroControl);
        
        if (!numeroControl) {
            showMessage('mensaje-busqueda', 'Ingrese un número de control', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/buscar/${numeroControl}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Respuesta status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Resultado búsqueda:', result);
            
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
            console.error('Error:', error);
            showMessage('mensaje-busqueda', 'Error de conexión: ' + error.message, 'error');
        }
    });
}

function initActualizacion() {
    const formBuscar = document.getElementById('formulario-buscar-actualizar');
    const formActualizar = document.getElementById('formulario-actualizar');
    
    console.log('Formulario buscar actualizar:', formBuscar);
    console.log('Formulario actualizar:', formActualizar);
    
    if (!formBuscar || !formActualizar) return;
    
    formBuscar.addEventListener('submit', async function(e) {
        e.preventDefault(); // PREVENIR ENVÍO POR GET
        
        const numeroControl = document.getElementById('actualizar-numero').value.trim();
        console.log('Buscando para actualizar:', numeroControl);
        
        if (!numeroControl) {
            showMessage('mensaje-actualizar', 'Ingrese un número de control', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/buscar/${numeroControl}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Respuesta status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Resultado búsqueda:', result);
            
            if (result.status === 'error') {
                showMessage('mensaje-actualizar', result.message, 'error');
                formActualizar.style.display = 'none';
            } else {
                showMessage('mensaje-actualizar', 'Profesor encontrado', 'success');
                fillUpdateForm(result);
                formActualizar.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('mensaje-actualizar', 'Error de conexión: ' + error.message, 'error');
        }
    });
    
    formActualizar.addEventListener('submit', async function(e) {
        e.preventDefault(); // PREVENIR ENVÍO POR GET
        
        const btnSubmit = formActualizar.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Actualizando...';
        
        const formData = new FormData(formActualizar);
        const data = Object.fromEntries(formData);
        
        console.log('Datos para actualizar:', data);
        
        try {
            const response = await fetch(`${API_BASE}/actualizar`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            console.log('Respuesta status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Resultado:', result);
            
            showMessage('mensaje-actualizar', result.message, result.status);
            
            if (result.status === 'success') {
                setTimeout(() => {
                    formActualizar.style.display = 'none';
                    formActualizar.reset();
                    formBuscar.reset();
                }, 2000);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('mensaje-actualizar', 'Error de conexión: ' + error.message, 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
        }
    });
}

function initEliminacion() {
    const formBuscar = document.getElementById('formulario-buscar-eliminar');
    const btnConfirmar = document.getElementById('btn-eliminar-confirmar');
    
    console.log('Formulario eliminar:', formBuscar);
    console.log('Botón confirmar:', btnConfirmar);
    
    if (!formBuscar || !btnConfirmar) return;
    
    formBuscar.addEventListener('submit', async function(e) {
        e.preventDefault(); // PREVENIR ENVÍO POR GET
        
        const numeroControl = document.getElementById('eliminar-numero').value.trim();
        const datosDiv = document.getElementById('datos-profesor');
        const infoDiv = document.getElementById('info-profesor');
        
        console.log('Buscando para eliminar:', numeroControl);
        
        if (!numeroControl) {
            showMessage('mensaje-eliminar', 'Ingrese un número de control', 'error');
            return;
        }
        
        try {
            const searchResponse = await fetch(`${API_BASE}/buscar/${numeroControl}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Respuesta status:', searchResponse.status);
            
            if (!searchResponse.ok) {
                throw new Error(`HTTP error! status: ${searchResponse.status}`);
            }
            
            const result = await searchResponse.json();
            console.log('Resultado búsqueda:', result);
            
            if (result.status === 'error') {
                showMessage('mensaje-eliminar', result.message, 'error');
                if (datosDiv) {
                    datosDiv.style.display = 'none';
                }
                if (btnConfirmar) {
                    btnConfirmar.style.display = 'none';
                }
                return;
            }
            
            showMessage('mensaje-eliminar', 'Profesor encontrado', 'info');
            displayProfesorDataForDelete(infoDiv, result);
            
            if (datosDiv) datosDiv.style.display = 'block';
            if (btnConfirmar) btnConfirmar.style.display = 'block';
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('mensaje-eliminar', 'Error de conexión: ' + error.message, 'error');
        }
    });
    
    btnConfirmar.addEventListener('click', async function() {
        const numeroControl = document.getElementById('eliminar-numero').value.trim();
        
        console.log('Confirmando eliminación de:', numeroControl);
        
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
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ numero_de_control: numeroControl })
            });
            
            console.log('Respuesta eliminación status:', deleteResponse.status);
            
            if (!deleteResponse.ok) {
                throw new Error(`HTTP error! status: ${deleteResponse.status}`);
            }
            
            const result = await deleteResponse.json();
            console.log('Resultado eliminación:', result);
            
            showMessage('mensaje-eliminar', result.message, result.status);
            
            if (result.status === 'success') {
                formBuscar.reset();
                
                const datosDiv = document.getElementById('datos-profesor');
                if (datosDiv) {
                    datosDiv.style.display = 'none';
                }
                
                btnConfirmar.style.display = 'none';
                
                const infoDiv = document.getElementById('info-profesor');
                if (infoDiv) {
                    infoDiv.innerHTML = '';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('mensaje-eliminar', 'Error al eliminar: ' + error.message, 'error');
        } finally {
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = originalText;
        }
    });
}

// FUNCIONES AUXILIARES
function displayProfesorData(container, profesor) {
    if (!container) return;
    
    let html = '<div><h4>Datos del Profesor:</h4>';
    html += '<p><b>Número de Control:</b> ' + (profesor.numero_de_control || 'No especificado') + '</p>';
    html += '<p><b>Nombre:</b> ' + (profesor.nombre || 'No especificado') + '</p>';
    html += '<p><b>Especialidad:</b> ' + (profesor.especialidad || 'No especificado') + '</p>';
    html += '</div>';
    
    container.innerHTML = html;
}

function displayProfesorDataForDelete(container, profesor) {
    if (!container) return;
    
    let html = '<div><h4>Datos del Profesor a Eliminar:</h4>';
    html += '<p><b>Número de Control:</b> ' + (profesor.numero_de_control || 'No especificado') + '</p>';
    html += '<p><b>Nombre:</b> ' + (profesor.nombre || 'No especificado') + '</p>';
    html += '<p><b>Especialidad:</b> ' + (profesor.especialidad || 'No especificado') + '</p>';
    html += '</div>';
    
    container.innerHTML = html;
}

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

function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = text;
    element.className = `mensaje mensaje-${type}`;
    element.style.display = 'block';
    
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}