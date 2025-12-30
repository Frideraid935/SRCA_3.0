// alumnos.js - Controlador para las operaciones CRUD de alumnos

const API_BASE = '/api/alumnos';

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

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

// REGISTRAR ALUMNO
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

// BUSCAR ALUMNO
function initBusqueda() {
    const form = document.getElementById('formulario-buscar');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        const resultadosDiv = document.getElementById('resultados-busqueda');
        const datosDiv = document.getElementById('datos-alumno');
        const mensajeDiv = document.getElementById('mensaje-busqueda');
        
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
            } else {
                showMessage('mensaje-busqueda', 'Alumno encontrado', 'success');
                displayAlumnoData(datosDiv, result);
                if (resultadosDiv) resultadosDiv.style.display = 'block';
            }
        } catch (error) {
            showMessage('mensaje-busqueda', 'Error de conexión', 'error');
        }
    });
}

// ACTUALIZAR ALUMNO
function initActualizacion() {
    const formBuscar = document.getElementById('formulario-buscar');
    const formActualizar = document.getElementById('formulario-actualizar');
    
    if (!formBuscar || !formActualizar) return;
    
    // Buscar alumno
    formBuscar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        const mensajeDiv = document.getElementById('mensaje-actualizar');
        
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
    
    // Actualizar datos
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

// ELIMINAR ALUMNO
function initEliminacion() {
    const form = document.getElementById('formulario-eliminar');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        const datosDiv = document.getElementById('datos-alumno');
        const mensajeDiv = document.getElementById('mensaje-eliminar');
        
        if (!numeroControl) {
            showMessage('mensaje-eliminar', 'Ingrese un número de control', 'error');
            return;
        }
        
        try {
            // Buscar alumno primero
            const searchResponse = await fetch(`${API_BASE}/buscar/${numeroControl}`);
            const alumno = await searchResponse.json();
            
            if (alumno.status === 'error') {
                showMessage('mensaje-eliminar', alumno.message, 'error');
                if (datosDiv) datosDiv.style.display = 'none';
                return;
            }
            
            // Mostrar datos del alumno
            displayAlumnoData(datosDiv, alumno);
            if (datosDiv) datosDiv.style.display = 'block';
            
            // Confirmar eliminación
            const confirmar = confirm(`¿Eliminar al alumno: ${alumno.nombre} (${numeroControl})?`);
            
            if (!confirmar) return;
            
            // Eliminar alumno
            const deleteResponse = await fetch(`${API_BASE}/eliminar`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero_de_control: numeroControl })
            });
            
            const result = await deleteResponse.json();
            showMessage('mensaje-eliminar', result.message, result.status);
            
            if (result.status === 'success') {
                form.reset();
                if (datosDiv) {
                    datosDiv.style.display = 'none';
                    datosDiv.innerHTML = '';
                }
            }
        } catch (error) {
            showMessage('mensaje-eliminar', 'Error de conexión', 'error');
        }
    });
}

// FUNCIONES AUXILIARES
function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = text;
    element.className = `mensaje mensaje-${type}`;
    element.style.display = 'block';
}

function displayAlumnoData(container, alumno) {
    if (!container) return;
    
    const html = `
        <div class="alumno-info-card">
            <h3>${alumno.nombre || ''}</h3>
            <p><strong>Número de Control:</strong> ${alumno.numero_de_control || ''}</p>
            <p><strong>Curso:</strong> ${alumno.curso || ''}</p>
            <p><strong>Fecha Nacimiento:</strong> ${alumno.fecha_nacimiento || ''}</p>
            <p><strong>CURP:</strong> ${alumno.curp || ''}</p>
            <p><strong>Email:</strong> ${alumno.email || ''}</p>
            <p><strong>Teléfono:</strong> ${alumno.telefonos || ''}</p>
            <p><strong>Dirección:</strong> ${alumno.direccion || ''}</p>
            <p><strong>Población:</strong> ${alumno.poblacion || ''}</p>
            <p><strong>Estatus:</strong> ${alumno.estatus || ''}</p>
            ${alumno.alergico ? `<p><strong>Alergias:</strong> ${alumno.alergico}</p>` : ''}
            ${alumno.contacto_accidente ? `<p><strong>Contacto Emergencia:</strong> ${alumno.contacto_accidente}</p>` : ''}
        </div>
    `;
    
    container.innerHTML = html;
}

function fillUpdateForm(alumno) {
    // Campo oculto para el número de control
    const controlHidden = document.getElementById('numero_de_control_actualizar');
    if (controlHidden) {
        controlHidden.value = alumno.numero_de_control || '';
    }
    
    // Campos visibles
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