// publico/JS/admin.js - Sistema de administradores

const API_BASE = '/api/admin';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de administradores cargado');
    
    // Detectar qué página estamos cargando por los formularios
    const formRegistrar = document.getElementById('form-registrar-admin');
    const formBuscar = document.getElementById('form-buscar-admin');
    
    if (formRegistrar) {
        console.log('Página de REGISTRO detectada');
        configurarRegistro();
    } else if (formBuscar) {
        console.log('Página de ELIMINACIÓN detectada');
        configurarEliminacion();
    } else {
        console.log('No se encontró formulario de registro ni de búsqueda');
    }
});

// ===== REGISTRAR ADMINISTRADOR =====
function configurarRegistro() {
    const form = document.getElementById('form-registrar-admin');
    if (!form) return;
    
    console.log('Configurando formulario de registro');
    
    form.addEventListener('submit', function(e) {
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
        alert('Error: Campos no encontrados');
        return;
    }
    
    const usuario = inputUsuario.value.trim();
    const contrasena = inputContrasena.value.trim();
    
    if (!usuario) {
        mostrarMensaje(mensajeDiv, 'El usuario es obligatorio', 'error');
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
    
    const datos = {
        usuario: usuario,
        contrasena: contrasena
    };
    
    console.log('Enviando registro:', datos);
    
    fetch(API_BASE + '/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
        
        if (data.success) {
            mostrarMensaje(mensajeDiv, data.message, 'success');
            // Limpiar formulario
            inputUsuario.value = '';
            inputContrasena.value = '';
            inputUsuario.focus();
        } else {
            mostrarMensaje(mensajeDiv, data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(mensajeDiv, 'Error de conexión', 'error');
    })
    .finally(() => {
        btnRegistrar.disabled = false;
        btnRegistrar.innerHTML = textoOriginal;
    });
}

// ===== ELIMINAR ADMINISTRADOR =====
function configurarEliminacion() {
    console.log('Configurando eliminación');
    
    const formBuscar = document.getElementById('form-buscar-admin');
    const btnEliminar = document.getElementById('btn-confirmar-eliminar');
    
    if (formBuscar) {
        formBuscar.addEventListener('submit', function(e) {
            e.preventDefault();
            buscarAdmin();
        });
    }
    
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function(e) {
            e.preventDefault();
            confirmarEliminacion();
        });
    }
}

function buscarAdmin() {
    const inputUsuario = document.getElementById('usuario');
    const btnBuscar = document.querySelector('#form-buscar-admin button[type="submit"]');
    const mensajeDiv = document.getElementById('mensaje');
    const infoDiv = document.getElementById('info-admin');
    
    if (!inputUsuario || !btnBuscar) {
        alert('Error: Campos no encontrados');
        return;
    }
    
    const usuario = inputUsuario.value.trim();
    
    if (!usuario) {
        mostrarMensaje(mensajeDiv, 'Escriba un usuario', 'error');
        inputUsuario.focus();
        return;
    }
    
    const textoOriginal = btnBuscar.innerHTML;
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = 'Buscando...';
    
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    if (mensajeDiv) {
        mensajeDiv.innerHTML = '';
        mensajeDiv.className = 'mensaje';
        mensajeDiv.style.display = 'none';
    }
    
    console.log('Buscando:', usuario);
    
    fetch(API_BASE + '/buscar?usuario=' + encodeURIComponent(usuario))
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje(mensajeDiv, data.message, 'success');
            mostrarAdminEncontrado(data.admin);
        } else {
            mostrarMensaje(mensajeDiv, data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(mensajeDiv, 'Error de conexión', 'error');
    })
    .finally(() => {
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
    }
}

function confirmarEliminacion() {
    const infoUsuario = document.getElementById('info-usuario');
    const btnEliminar = document.getElementById('btn-confirmar-eliminar');
    const mensajeDiv = document.getElementById('mensaje');
    const infoDiv = document.getElementById('info-admin');
    
    if (!infoUsuario || !btnEliminar) {
        alert('Error: Información no disponible');
        return;
    }
    
    const usuario = infoUsuario.textContent.trim();
    
    if (!usuario) {
        mostrarMensaje(mensajeDiv, 'Primero busque un administrador', 'error');
        return;
    }
    
    if (!confirm('¿Eliminar al administrador: ' + usuario + '?')) {
        return;
    }
    
    const textoOriginal = btnEliminar.innerHTML;
    btnEliminar.disabled = true;
    btnEliminar.innerHTML = 'Eliminando...';
    
    const datos = { usuario: usuario };
    
    console.log('Eliminando:', datos);
    
    fetch(API_BASE + '/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje(mensajeDiv, data.message, 'success');
            
            // Limpiar todo
            const inputUsuario = document.getElementById('usuario');
            if (inputUsuario) inputUsuario.value = '';
            
            if (infoDiv) {
                infoDiv.style.display = 'none';
            }
            
            infoUsuario.textContent = '';
        } else {
            mostrarMensaje(mensajeDiv, data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(mensajeDiv, 'Error de conexión', 'error');
    })
    .finally(() => {
        btnEliminar.disabled = false;
        btnEliminar.innerHTML = textoOriginal;
    });
}

// ===== FUNCIÓN AUXILIAR =====
function mostrarMensaje(elemento, texto, tipo) {
    if (!elemento) {
        alert(texto);
        return;
    }
    
    let clase = '';
    if (tipo === 'success') {
        clase = 'mensaje-success';
    } else if (tipo === 'error') {
        clase = 'mensaje-error';
    } else if (tipo === 'warning') {
        clase = 'mensaje-warning';
    } else {
        clase = 'mensaje-info';
    }
    
    elemento.innerHTML = texto;
    elemento.className = 'mensaje ' + clase;
    elemento.style.display = 'block';
}

// Exportar funciones si se necesitan
window.registrarAdmin = registrarAdmin;
window.buscarAdmin = buscarAdmin;
window.confirmarEliminacion = confirmarEliminacion;