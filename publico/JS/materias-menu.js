// publico/JS/materias-menu.js - VERSIÓN FUNCIONAL

document.addEventListener('DOMContentLoaded', function() {
    console.log(' Módulo de Materias - Iniciando...');
    
    // Paso 1: Mostrar usuario por defecto inmediatamente
    mostrarUsuarioDefault();
    
    // Paso 2: Inicializar menú
    inicializarMenu();
    
    // Paso 3: Configurar eventos
    configurarEventos();
    
    // Paso 4: Verificar sesión en segundo plano (no bloqueante)
    setTimeout(verificarSesionBackground, 1000);
});

function mostrarUsuarioDefault() {
    const nombreUsuario = document.getElementById('nombre-usuario');
    if (nombreUsuario) {
        nombreUsuario.textContent = 'Administrador';
        console.log(' Usuario mostrado por defecto');
    }
}

function configurarEventos() {
    // Botón logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            console.log(' Cerrando sesión...');
            window.location.href = '../Login/login.html';
        });
    }
    
    // Botón volver inicio
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener('click', function() {
            console.log(' Volviendo al menú principal...');
            window.location.href = '../menu_inicio/menu_inicio_admin.html';
        });
    }
}

function inicializarMenu() {
    console.log(' Inicializando menú...');
    
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (menuItems.length === 0) {
        console.warn(' No se encontraron elementos de menú');
        return;
    }
    
    menuItems.forEach(item => {
        // Si ya tiene onclick, no hacer nada
        if (item.getAttribute('onclick')) return;
        
        item.addEventListener('click', function() {
            // Quitar active de todos
            menuItems.forEach(i => i.classList.remove('active'));
            // Agregar active a este
            this.classList.add('active');
            
            // Si tiene data-url, cargar ese formulario
            const url = this.getAttribute('data-url');
            if (url) {
                cargarFormulario(url);
            }
        });
    });
    
    // Cargar contenido inicial
    const activeItem = document.querySelector('.menu-item.active');
    if (activeItem) {
        const url = activeItem.getAttribute('data-url') || activeItem.getAttribute('onclick');
        if (url && url.includes("cargarFormulario")) {
            // Extraer URL del onclick
            const match = url.match(/cargarFormulario\('([^']+)'\)/);
            if (match && match[1]) {
                cargarFormulario(match[1]);
            }
        }
    }
}

function cargarFormulario(url) {
    console.log(` Cargando formulario: ${url}`);
    
    const iframe = document.getElementById('contenido-iframe');
    if (!iframe) {
        console.error(' No se encontró iframe con id "contenido-iframe"');
        return;
    }
    
    iframe.src = url;
    
    iframe.onload = function() {
        console.log(` Formulario cargado: ${url}`);
    };
    
    iframe.onerror = function() {
        console.error(` Error al cargar: ${url}`);
        iframe.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h3 style="color: #e74c3c;">Error al cargar el formulario</h3>
                <p>No se pudo cargar: ${url}</p>
                <p>Verifica que el archivo exista en la carpeta Modulo-Materias-Admin</p>
            </div>
        `;
    };
}

function verificarSesionBackground() {
    console.log(' Verificando sesión en segundo plano...');
    
    // Usar la ruta CORRECTA según tu server.js
    fetch('/api/check', {
        method: 'GET',
        credentials: 'include' // IMPORTANTE: para enviar cookies
    })
    .then(response => {
        console.log('Respuesta de verificación:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Datos de sesión:', data);
        
        if (data.loggedIn && data.user) {
            console.log(' Sesión activa:', data.user.nombre);
            
            // Actualizar nombre de usuario
            const nombreUsuario = document.getElementById('nombre-usuario');
            if (nombreUsuario) {
                nombreUsuario.textContent = data.user.nombre;
            }
            
            // Verificar si es admin
            if (data.user.rol !== 'admin') {
                console.warn(' Usuario no es administrador');
            }
        } else {
            console.log(' No hay sesión activa, continuando en modo local...');
            // NO redirigir - permitir usar el sistema
        }
    })
    .catch(error => {
        console.log(' No se pudo conectar al servidor de sesión:', error.message);
        console.log(' Continuando en modo offline...');
    });
}

// Exportar funciones para uso global
window.cargarFormulario = cargarFormulario;
window.verificarSesionBackground = verificarSesionBackground;

// Función de emergencia
window.modoDesarrollo = function() {
    console.log(' Activando modo desarrollo...');
    const nombreUsuario = document.getElementById('nombre-usuario');
    if (nombreUsuario) {
        nombreUsuario.textContent = 'Admin (Modo Desarrollo)';
    }
    alert('Modo desarrollo activado. Las verificaciones de sesión están desactivadas.');
};

console.log(' materias-menu.js cargado correctamente');