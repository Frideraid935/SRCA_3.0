// alumnos.js - Controlador principal para todas las páginas de alumnos

import { AlumnosAPI } from './alumnos-api.js';

document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ Sistema de Alumnos cargado");
    
    // Detectar en qué página estamos
    const path = window.location.pathname;
    const pagina = path.split('/').pop();
    
    // Inicializar funciones según la página
    switch(pagina) {
        case 'Ingresar_Alumno_admin.html':
            inicializarRegistro();
            break;
        case 'Buscar_alumno_admin.html':
            await inicializarBusqueda();
            break;
        case 'Actualizar_alumno_admin.html':
            inicializarActualizacion();
            break;
        case 'Borrar_alumno_admin.html':
            await inicializarEliminacion();
            break;
    }
});

// ===============================
// 1. REGISTRAR ALUMNO
// ===============================
function inicializarRegistro() {
    const form = document.getElementById('formulario-registro');
    const mensajeDiv = document.getElementById('mensaje-registro');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Deshabilitar botón para evitar doble envío
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Registrando...';
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validación básica
        if (!data.numero_de_control || !data.nombre || !data.curp) {
            mostrarMensaje(mensajeDiv, 'Por favor complete los campos obligatorios', 'error');
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalText;
            return;
        }
        
        // Establecer estatus por defecto
        data.estatus = 'activo';
        
        // Enviar al servidor
        const resultado = await AlumnosAPI.registrar(data);
        
        if (resultado.status === 'success') {
            mostrarMensaje(mensajeDiv, resultado.message, 'success');
            form.reset();
            
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => {
                mensajeDiv.style.display = 'none';
            }, 3000);
        } else {
            mostrarMensaje(mensajeDiv, resultado.message, 'error');
        }
        
        // Restaurar botón
        btnSubmit.disabled = false;
        btnSubmit.textContent = originalText;
    });
}

// ===============================
// 2. BUSCAR ALUMNO
// ===============================
async function inicializarBusqueda() {
    const form = document.getElementById('formulario-buscar');
    const resultadosDiv = document.getElementById('resultados-busqueda');
    const datosAlumnoDiv = document.getElementById('datos-alumno');
    const mensajeDiv = document.getElementById('mensaje-busqueda');
    
    if (!form) return;
    
    // Cargar todos los alumnos al inicio
    await cargarTodosLosAlumnos();
    
    // Buscar por número de control
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        
        if (!numeroControl) {
            mostrarMensaje(mensajeDiv, 'Ingrese un número de control', 'error');
            return;
        }
        
        const resultado = await AlumnosAPI.buscarPorNumero(numeroControl);
        
        if (resultado.status === 'error') {
            mostrarMensaje(mensajeDiv, resultado.message, 'error');
            resultadosDiv.style.display = 'none';
        } else {
            mostrarMensaje(mensajeDiv, 'Alumno encontrado', 'success');
            mostrarDatosAlumno(datosAlumnoDiv, resultado);
            resultadosDiv.style.display = 'block';
        }
    });
}

async function cargarTodosLosAlumnos() {
    const datosAlumnoDiv = document.getElementById('datos-alumno');
    if (!datosAlumnoDiv) return;
    
    const alumnos = await AlumnosAPI.listarTodos();
    
    if (alumnos.length === 0) {
        datosAlumnoDiv.innerHTML = '<p class="no-data">No hay alumnos registrados</p>';
        return;
    }
    
    let html = '<div class="tabla-container"><table class="tabla-alumnos">';
    html += '<thead><tr><th>No. Control</th><th>Nombre</th><th>Curso</th><th>Email</th><th>Estatus</th></tr></thead>';
    html += '<tbody>';
    
    alumnos.forEach(alumno => {
        html += `
            <tr>
                <td>${alumno.numero_de_control || ''}</td>
                <td>${alumno.nombre || ''}</td>
                <td>${alumno.curso || ''}</td>
                <td>${alumno.email || ''}</td>
                <td><span class="estatus ${alumno.estatus}">${alumno.estatus || ''}</span></td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    datosAlumnoDiv.innerHTML = html;
}

// ===============================
// 3. ACTUALIZAR ALUMNO
// ===============================
function inicializarActualizacion() {
    const formBuscar = document.getElementById('formulario-buscar');
    const formActualizar = document.getElementById('formulario-actualizar');
    const mensajeDiv = document.getElementById('mensaje-actualizar');
    
    if (!formBuscar || !formActualizar) return;
    
    // Buscar alumno para actualizar
    formBuscar.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        
        if (!numeroControl) {
            mostrarMensaje(mensajeDiv, 'Ingrese un número de control', 'error');
            return;
        }
        
        const resultado = await AlumnosAPI.buscarPorNumero(numeroControl);
        
        if (resultado.status === 'error') {
            mostrarMensaje(mensajeDiv, resultado.message, 'error');
            formActualizar.style.display = 'none';
        } else {
            mostrarMensaje(mensajeDiv, 'Alumno encontrado. Modifique los datos necesarios.', 'success');
            llenarFormularioActualizar(resultado);
            formActualizar.style.display = 'block';
        }
    });
    
    // Actualizar datos del alumno
    formActualizar.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btnSubmit = formActualizar.querySelector('button[type="submit"]');
        const originalText = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Actualizando...';
        
        const formData = new FormData(formActualizar);
        const data = Object.fromEntries(formData);
        
        const resultado = await AlumnosAPI.actualizar(data);
        
        if (resultado.status === 'success') {
            mostrarMensaje(mensajeDiv, resultado.message, 'success');
            
            // Ocultar formulario después de actualizar
            setTimeout(() => {
                formActualizar.style.display = 'none';
                formBuscar.reset();
                mensajeDiv.style.display = 'none';
            }, 2000);
        } else {
            mostrarMensaje(mensajeDiv, resultado.message, 'error');
        }
        
        btnSubmit.disabled = false;
        btnSubmit.textContent = originalText;
    });
}

function llenarFormularioActualizar(alumno) {
    const campos = [
        'numero_de_control', 'nombre', 'fecha_nacimiento', 'curso',
        'poblacion', 'direccion', 'email', 'telefonos', 'curp',
        'estatus', 'alergico', 'contacto_accidente', 'telefonos_contacto',
        'nombre_autorizado', 'curp_autorizado'
    ];
    
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        if (input && alumno[campo]) {
            input.value = alumno[campo];
        }
    });
    
    // Campo oculto para el número de control
    const controlActualizar = document.getElementById('numero_de_control_actualizar');
    if (controlActualizar && alumno.numero_de_control) {
        controlActualizar.value = alumno.numero_de_control;
    }
}

// ===============================
// 4. ELIMINAR ALUMNO
// ===============================
async function inicializarEliminacion() {
    const form = document.getElementById('formulario-eliminar');
    const datosAlumnoDiv = document.getElementById('datos-alumno');
    const mensajeDiv = document.getElementById('mensaje-eliminar');
    
    if (!form) return;
    
    // Cargar todos los alumnos al inicio
    await cargarTodosLosAlumnosParaEliminar();
    
    // Buscar para eliminar
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const numeroControl = document.getElementById('numero_de_control').value.trim();
        
        if (!numeroControl) {
            mostrarMensaje(mensajeDiv, 'Ingrese un número de control', 'error');
            return;
        }
        
        // Mostrar confirmación
        if (!confirm(`¿Está seguro de eliminar al alumno con número de control: ${numeroControl}?`)) {
            return;
        }
        
        const resultado = await AlumnosAPI.eliminar(numeroControl);
        
        if (resultado.status === 'success') {
            mostrarMensaje(mensajeDiv, resultado.message, 'success');
            form.reset();
            
            // Recargar lista de alumnos
            setTimeout(() => {
                cargarTodosLosAlumnosParaEliminar();
                mensajeDiv.style.display = 'none';
            }, 1500);
        } else {
            mostrarMensaje(mensajeDiv, resultado.message, 'error');
        }
    });
}

async function cargarTodosLosAlumnosParaEliminar() {
    const datosAlumnoDiv = document.getElementById('datos-alumno');
    if (!datosAlumnoDiv) return;
    
    const alumnos = await AlumnosAPI.listarTodos();
    
    if (alumnos.length === 0) {
        datosAlumnoDiv.innerHTML = '<p class="no-data">No hay alumnos registrados</p>';
        return;
    }
    
    let html = '<h3>Alumnos Registrados</h3>';
    html += '<div class="tabla-container"><table class="tabla-alumnos">';
    html += '<thead><tr><th>No. Control</th><th>Nombre</th><th>Curso</th><th>Email</th><th>Acción</th></tr></thead>';
    html += '<tbody>';
    
    alumnos.forEach(alumno => {
        html += `
            <tr>
                <td>${alumno.numero_de_control || ''}</td>
                <td>${alumno.nombre || ''}</td>
                <td>${alumno.curso || ''}</td>
                <td>${alumno.email || ''}</td>
                <td>
                    <button class="btn-eliminar-directo" 
                            data-numero="${alumno.numero_de_control}"
                            data-nombre="${alumno.nombre}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    datosAlumnoDiv.innerHTML = html;
    
    // Agregar eventos a los botones de eliminar directo
    document.querySelectorAll('.btn-eliminar-directo').forEach(btn => {
        btn.addEventListener('click', async function() {
            const numero = this.getAttribute('data-numero');
            const nombre = this.getAttribute('data-nombre');
            
            if (confirm(`¿Eliminar al alumno: ${nombre} (${numero})?`)) {
                const resultado = await AlumnosAPI.eliminar(numero);
                const mensajeDiv = document.getElementById('mensaje-eliminar');
                
                if (resultado.status === 'success') {
                    mostrarMensaje(mensajeDiv, resultado.message, 'success');
                    setTimeout(() => {
                        cargarTodosLosAlumnosParaEliminar();
                        mensajeDiv.style.display = 'none';
                    }, 1500);
                } else {
                    mostrarMensaje(mensajeDiv, resultado.message, 'error');
                }
            }
        });
    });
}

// ===============================
// FUNCIONES AUXILIARES
// ===============================
function mostrarMensaje(elemento, texto, tipo = 'info') {
    if (!elemento) return;
    
    elemento.textContent = texto;
    elemento.className = `mensaje mensaje-${tipo}`;
    elemento.style.display = 'block';
}

function mostrarDatosAlumno(elemento, alumno) {
    if (!elemento || !alumno) return;
    
    const html = `
        <div class="card-alumno">
            <h3>${alumno.nombre || ''}</h3>
            <p><strong>No. Control:</strong> ${alumno.numero_de_control || ''}</p>
            <p><strong>Curso:</strong> ${alumno.curso || ''}</p>
            <p><strong>Email:</strong> ${alumno.email || ''}</p>
            <p><strong>Teléfono:</strong> ${alumno.telefonos || ''}</p>
            <p><strong>Dirección:</strong> ${alumno.direccion || ''}</p>
            <p><strong>Estatus:</strong> <span class="estatus ${alumno.estatus}">${alumno.estatus || ''}</span></p>
        </div>
    `;
    
    elemento.innerHTML = html;
}