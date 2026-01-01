// publico/JS/materias.js

const API_BASE = '/api/materias';

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

// Determinar qué página se está cargando
function initPage() {
    const path = window.location.pathname;
    
    console.log('Ruta actual:', path);
    
    if (path.includes('registrar_materia')) {
        initRegistro();
    } else if (path.includes('eliminar_materia')) {
        initEliminacion();
    }
}

// ===============================
// 1. REGISTRAR MATERIA
// ===============================
function initRegistro() {
    const form = document.getElementById('formulario-ingresar');
    if (!form) {
        console.error('Formulario de registro no encontrado');
        return;
    }
    
    console.log('Inicializando registro de materia');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Enviando...';
        
        // Obtener datos
        const nombre = document.getElementById('materia-nombre').value.trim();
        
        if (!nombre) {
            showMessage('mensaje-ingresar', 'El nombre de la materia es obligatorio', 'error');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalText;
            return;
        }
        
        const data = { nombre: nombre };
        
        try {
            const response = await fetch(`${API_BASE}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('mensaje-ingresar', result.message, 'success');
                form.reset();
            } else {
                showMessage('mensaje-ingresar', result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('mensaje-ingresar', 'Error de conexión', 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalText;
        }
    });
}

// ===============================
// 2. ELIMINAR MATERIA
// ===============================
function initEliminacion() {
    console.log('Inicializando eliminación de materia');
    
    const formBuscar = document.getElementById('form-buscar-materia');
    const formConfirmar = document.getElementById('form-confirmar-eliminar');
    
    if (!formBuscar) {
        console.error('Formulario de búsqueda no encontrado');
        return;
    }
    
    // Configurar búsqueda
    formBuscar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnBuscar = formBuscar.querySelector('button[type="submit"]');
        const originalText = btnBuscar.innerHTML;
        btnBuscar.disabled = true;
        btnBuscar.innerHTML = 'Buscando...';
        
        const nombre = document.getElementById('buscar-nombre').value.trim();
        
        if (!nombre) {
            showMessage('mensaje-eliminar', 'Ingrese el nombre de la materia', 'error');
            btnBuscar.disabled = false;
            btnBuscar.innerHTML = originalText;
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/buscar?nombre=${encodeURIComponent(nombre)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('mensaje-eliminar', 'Materia encontrada', 'success');
                mostrarMateriaEncontrada(result.materia);
            } else {
                showMessage('mensaje-eliminar', result.message, 'error');
                ocultarInformacionMateria();
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
            
            if (error.message.includes('Failed to fetch')) {
                showMessage('mensaje-eliminar', 'No se pudo conectar al servidor. Verifique su conexión.', 'error');
            } else {
                showMessage('mensaje-eliminar', 'Error en la búsqueda: ' + error.message, 'error');
            }
            
            ocultarInformacionMateria();
        } finally {
            btnBuscar.disabled = false;
            btnBuscar.innerHTML = originalText;
        }
    });
    
    // Configurar confirmación de eliminación
    if (formConfirmar) {
        formConfirmar.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btnEliminar = formConfirmar.querySelector('button[type="submit"]');
            const originalText = btnEliminar.innerHTML;
            btnEliminar.disabled = true;
            btnEliminar.innerHTML = 'Eliminando...';
            
            const id = document.getElementById('info-id').textContent.trim();
            const nombre = document.getElementById('info-nombre').textContent.trim();
            
            if (!id) {
                showMessage('mensaje-eliminar', 'Primero debe buscar una materia', 'error');
                btnEliminar.disabled = false;
                btnEliminar.innerHTML = originalText;
                return;
            }
            
            // Confirmación
            if (!confirm(`¿Está seguro de eliminar la materia "${nombre}"? Esta acción no se puede deshacer.`)) {
                btnEliminar.disabled = false;
                btnEliminar.innerHTML = originalText;
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE}/eliminar`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: parseInt(id) })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('mensaje-eliminar', result.message, 'success');
                    
                    // Limpiar todo
                    document.getElementById('buscar-nombre').value = '';
                    ocultarInformacionMateria();
                    
                    // Ocultar mensaje después de 3 segundos
                    setTimeout(() => {
                        const msg = document.getElementById('mensaje-eliminar');
                        if (msg) msg.style.display = 'none';
                    }, 3000);
                } else {
                    showMessage('mensaje-eliminar', result.message, 'error');
                }
            } catch (error) {
                console.error('Error en eliminación:', error);
                showMessage('mensaje-eliminar', 'Error de conexión al eliminar', 'error');
            } finally {
                btnEliminar.disabled = false;
                btnEliminar.innerHTML = originalText;
            }
        });
    }
}

// ===============================
// FUNCIONES AUXILIARES
// ===============================

function mostrarMateriaEncontrada(materia) {
    console.log('Mostrando materia:', materia);
    
    document.getElementById('info-id').textContent = materia.id;
    document.getElementById('info-nombre').textContent = materia.nombre;
    
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'block';
    }
}

function ocultarInformacionMateria() {
    const infoDiv = document.getElementById('info-materia');
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    document.getElementById('info-id').textContent = '';
    document.getElementById('info-nombre').textContent = '';
}

function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn('Elemento no encontrado:', elementId);
        alert(text);
        return;
    }
    
    // Colores según tipo
    let color = '#17a2b8'; // info por defecto
    let backgroundColor = '#d1ecf1';
    
    if (type === 'success') {
        color = '#28a745';
        backgroundColor = '#d4edda';
    } else if (type === 'error') {
        color = '#dc3545';
        backgroundColor = '#f8d7da';
    } else if (type === 'warning') {
        color = '#ffc107';
        backgroundColor = '#fff3cd';
    }
    
    element.innerHTML = `
        <div style="
            padding: 12px;
            margin: 10px 0;
            border-radius: 4px;
            border-left: 4px solid ${color};
            background-color: ${backgroundColor};
            color: ${color === '#ffc107' ? '#856404' : color === '#17a2b8' ? '#0c5460' : color === '#28a745' ? '#155724' : '#721c24'};
        ">
            ${text}
        </div>
    `;
    element.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (element.innerHTML.includes(text)) {
            element.style.display = 'none';
            element.innerHTML = '';
        }
    }, 5000);
}