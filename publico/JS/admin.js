// Controladores_admin/admin.js - Sistema completo de administradores

const API_BASE = '/api/admin';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de administradores cargado');
    
    // Detectar qué página estamos cargando
    const path = window.location.pathname;
    
    if (path.includes('registrar_admin')) {
        initRegistro();
    } else if (path.includes('Eliminar_admin')) {
        initEliminacion();
    } else {
        console.log('Página de admin no reconocida:', path);
    }
});

// ===============================
// 1. REGISTRAR ADMINISTRADOR
// ===============================
function initRegistro() {
    const formRegistrar = document.getElementById('form-registrar-admin');
    if (!formRegistrar) {
        console.error('Formulario de registro no encontrado');
        return;
    }
    
    console.log('Inicializando registro de administrador');
    
    formRegistrar.addEventListener('submit', function(e) {
        e.preventDefault();
        registrarAdmin();
    });
}

function registrarAdmin() {
    const inputUsuario = document.getElementById('usuario');
    const inputContrasena = document.getElementById('contrasena');
    const btnRegistrar = document.querySelector('#form-registrar-admin button[type="submit"]');
    const mensajeDiv = document.getElementById('mensaje');
    
    if (!inputUsuario || !inputContrasena || !btnRegistrar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const usuario = inputUsuario.value.trim();
    const contrasena = inputContrasena.value.trim();
    
    if (!usuario) {
        mostrarMensaje(mensajeDiv, 'El nombre de usuario es obligatorio', 'error');
        inputUsuario.focus();
        return;
    }
    
    if (!contrasena) {
        mostrarMensaje(mensajeDiv, 'La contraseña es obligatoria', 'error');
        inputContrasena.focus();
        return;
    }
    
    const textoOriginal = btnRegistrar.innerHTML;
    btnRegistrar.disabled = true;
    btnRegistrar.innerHTML = 'Registrando...';
    
    // Timer de seguridad
    const safetyTimer = setTimeout(() => {
        btnRegistrar.disabled = false;
        btnRegistrar.innerHTML = textoOriginal;
        mostrarMensaje(mensajeDiv, 'El servidor está tardando en responder', 'warning');
    }, 30000);
    
    const datos = {
        usuario: usuario,
        contrasena: contrasena
    };
    
    console.log('Registrando admin:', datos);
    
    fetch(API_BASE + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        clearTimeout(safetyTimer);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarMensaje(mensajeDiv, data.message, 'success');
            
            // Limpiar formulario
            inputUsuario.value = '';
            inputContrasena.value = '';
            
            // Enfocar campo de usuario para nuevo registro
            inputUsuario.focus();
        } else {
            mostrarMensaje(mensajeDiv, data.message, 'error');
        }
    })
    .catch(error => {
        clearTimeout(safetyTimer);
        console.error('Error:', error);
        mostrarMensaje(mensajeDiv, 'Error de conexión con el servidor', 'error');
    })
    .finally(() => {
        clearTimeout(safetyTimer);
        btnRegistrar.disabled = false;
        btnRegistrar.innerHTML = textoOriginal;
    });
}

// ===============================
// 2. ELIMINAR ADMINISTRADOR
// ===============================
function initEliminacion() {
    console.log('Inicializando eliminación de administrador');
    
    // Configurar búsqueda
    const formBuscar = document.getElementById('form-buscar-admin');
    if (formBuscar) {
        formBuscar.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarAdminParaEliminar();
        });
    }
    
    // Configurar eliminación
    const btnEliminar = document.getElementById('btn-confirmar-eliminar');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function(e) {
            e.preventDefault();
            confirmarEliminacionAdmin();
        });
    }
}

function buscarAdminParaEliminar() {
    const inputUsuario = document.getElementById('usuario');
    const btnBuscar = document.querySelector('#form-buscar-admin button[type="submit"]');
    const mensajeDiv = document.getElementById('mensaje');
    const infoDiv = document.getElementById('info-admin');
    
    if (!inputUsuario || !btnBuscar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const usuario = inputUsuario.value.trim();
    
    if (!usuario) {
        mostrarMensaje(mensajeDiv, 'Escriba un nombre de usuario', 'error');
        inputUsuario.focus();
        return;
    }
    
    const textoOriginal = btnBuscar.innerHTML;
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = 'Buscando...';
    
    // Ocultar información anterior
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    // Limpiar mensajes anteriores
    if (mensajeDiv) {
        mensajeDiv.innerHTML = '';
        mensajeDiv.className = 'mensaje';
        mensajeDiv.style.display = 'none';
    }
    
    // Timer de seguridad
    const safetyTimer = setTimeout(() => {
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = textoOriginal;
        mostrarMensaje(mensajeDiv, 'El servidor está tardando en responder', 'warning');
    }, 30000);
    
    console.log('Buscando admin:', usuario);
    
    fetch(API_BASE + '/buscar?usuario=' + encodeURIComponent(usuario))
    .then(response => {
        clearTimeout(safetyTimer);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarMensaje(mensajeDiv, data.message, 'success');
            mostrarAdminEncontrado(data.admin);
        } else {
            mostrarMensaje(mensajeDiv, data.message, 'error');
        }
    })
    .catch(error => {
        clearTimeout(safetyTimer);
        console.error('Error:', error);
        mostrarMensaje(mensajeDiv, 'Error de conexión', 'error');
    })
    .finally(() => {
        clearTimeout(safetyTimer);
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = textoOriginal;
    });
}

function mostrarAdminEncontrado(admin) {
    const infoDiv = document.getElementById('info-admin');
    const infoUsuario = document.getElementById('info-usuario');
    
    if (infoUsuario) {
        infoUsuario.textContent = admin.usuario;
    }
    
    if (infoDiv) {
        infoDiv.style.display = 'block';
        
        // Desplazar vista para que se vea
        setTimeout(() => {
            infoDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
}

function confirmarEliminacionAdmin() {
    const infoUsuario = document.getElementById('info-usuario');
    const btnEliminar = document.getElementById('btn-confirmar-eliminar');
    const mensajeDiv = document.getElementById('mensaje');
    const infoDiv = document.getElementById('info-admin');
    
    if (!infoUsuario || !btnEliminar) {
        alert('Error: Elementos no encontrados');
        return;
    }
    
    const usuario = infoUsuario.textContent.trim();
    
    if (!usuario) {
        mostrarMensaje(mensajeDiv, 'Primero busque un administrador', 'error');
        return;
    }
    
    // Confirmación final
    if (!confirm('¿ESTA SEGURO DE ELIMINAR ESTE ADMINISTRADOR?\n\nUsuario: ' + usuario + '\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    const textoOriginal = btnEliminar.innerHTML;
    btnEliminar.disabled = true;
    btnEliminar.innerHTML = 'Eliminando...';
    
    // Timer de seguridad
    const safetyTimer = setTimeout(() => {
        btnEliminar.disabled = false;
        btnEliminar.innerHTML = textoOriginal;
        mostrarMensaje(mensajeDiv, 'El servidor está tardando en responder', 'warning');
    }, 30000);
    
    const datos = { usuario: usuario };
    
    console.log('Eliminando admin:', datos);
    
    fetch(API_BASE + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        clearTimeout(safetyTimer);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarMensaje(mensajeDiv, data.message, 'success');
            
            // Limpiar todo el formulario
            const inputUsuario = document.getElementById('usuario');
            if (inputUsuario) inputUsuario.value = '';
            
            if (infoDiv) {
                infoDiv.style.display = 'none';
            }
            
            infoUsuario.textContent = '';
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                if (mensajeDiv && mensajeDiv.style.display === 'block') {
                    mensajeDiv.style.display = 'none';
                }
            }, 5000);
        } else {
            mostrarMensaje(mensajeDiv, data.message, 'error');
        }
    })
    .catch(error => {
        clearTimeout(safetyTimer);
        console.error('Error:', error);
        mostrarMensaje(mensajeDiv, 'Error de conexión', 'error');
    })
    .finally(() => {
        clearTimeout(safetyTimer);
        btnEliminar.disabled = false;
        btnEliminar.innerHTML = textoOriginal;
    });
}

// ===============================
// FUNCIONES AUXILIARES
// ===============================
function mostrarMensaje(elemento, texto, tipo) {
    if (!elemento) {
        alert(texto);
        return;
    }
    
    // Determinar clase CSS según tipo
    let claseCss = 'mensaje-';
    switch(tipo) {
        case 'success': claseCss += 'success'; break;
        case 'error': claseCss += 'error'; break;
        case 'warning': claseCss += 'warning'; break;
        default: claseCss += 'info';
    }
    
    elemento.innerHTML = texto;
    elemento.className = 'mensaje ' + claseCss;
    elemento.style.display = 'block';
    
    // Auto-ocultar mensajes de éxito después de 5 segundos
    if (tipo === 'success' || tipo === 'info') {
        setTimeout(() => {
            if (elemento.innerHTML === texto) {
                elemento.style.display = 'none';
                elemento.innerHTML = '';
            }
        }, 5000);
    }
}

// ===============================
// EXPORTAR FUNCIONES (si se necesitan)
// ===============================
window.registrarAdmin = registrarAdmin;
window.buscarAdminParaEliminar = buscarAdminParaEliminar;
window.confirmarEliminacionAdmin = confirmarEliminacionAdmin;