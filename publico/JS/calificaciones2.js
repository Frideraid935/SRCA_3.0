// calificaciones.js
const API_BASE = window.location.origin + '/api/calificaciones2';

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo = 'success') {
    const mensajeDiv = document.getElementById('mensaje');
    if (mensajeDiv) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = 'mensaje mensaje-' + tipo;
        mensajeDiv.style.display = 'block';
        
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
        }, 5000);
    }
}

// Función para buscar calificaciones
window.buscarCalificaciones = async function() {
    const numeroControl = document.getElementById('numero_de_control').value.trim();
    
    if (!numeroControl) {
        mostrarMensaje('Ingrese un número de control', 'error');
        return;
    }
    
    // Ocultar secciones anteriores
    document.getElementById('info-alumno').style.display = 'none';
    document.getElementById('tabla-calificaciones').style.display = 'none';
    document.getElementById('sin-resultados').style.display = 'none';
    
    try {
        mostrarMensaje('Buscando calificaciones...', 'info');
        
        const response = await fetch(`${API_BASE}/buscar/${numeroControl}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            mostrarResultados(result);
        } else {
            mostrarMensaje(result.message, 'error');
            document.getElementById('sin-resultados').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
    }
}

// Función para mostrar resultados
function mostrarResultados(result) {
    const infoAlumnoDiv = document.getElementById('info-alumno');
    const datosAlumnoDiv = document.getElementById('datos-alumno');
    const tablaDiv = document.getElementById('tabla-calificaciones');
    const contenidoTablaDiv = document.getElementById('contenido-tabla');
    const sinResultadosDiv = document.getElementById('sin-resultados');
    
    // Mostrar información del alumno
    datosAlumnoDiv.innerHTML = `
        <p><strong>Número de Control:</strong> ${result.alumno.numero_de_control}</p>
        <p><strong>Nombre:</strong> ${result.alumno.nombre}</p>
        <p><strong>Curso:</strong> ${result.alumno.curso}</p>
        <p><strong>Total de calificaciones:</strong> ${result.calificaciones.length}</p>
    `;
    infoAlumnoDiv.style.display = 'block';
    
    // Mostrar tabla de calificaciones si hay resultados
    if (result.calificaciones.length > 0) {
        let tablaHTML = `
            <table class="tabla-calificaciones">
                <thead>
                    <tr>
                        <th>Materia</th>
                        <th>Calificación</th>
                        <th>Profesor</th>
                    </tr>
                </thead>
                <tbody>`;
        
        result.calificaciones.forEach(calif => {
            tablaHTML += `
                <tr>
                    <td>${calif.materia_nombre || 'No asignada'}</td>
                    <td>${calif.calificacion}</td>
                    <td>${calif.profesor_nombre || 'No asignado'}</td>
                </tr>`;
        });
        
        tablaHTML += '</tbody></table>';
        
        contenidoTablaDiv.innerHTML = tablaHTML;
        tablaDiv.style.display = 'block';
        sinResultadosDiv.style.display = 'none';
        
        mostrarMensaje(`Se encontraron ${result.calificaciones.length} calificaciones`, 'success');
    } else {
        tablaDiv.style.display = 'none';
        sinResultadosDiv.style.display = 'block';
        mostrarMensaje('El alumno no tiene calificaciones registradas', 'info');
    }
}