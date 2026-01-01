// publico/JS/materias-menu.js

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el menú
    inicializarMenu();
    
    // Verificar sesión al cargar
    verificarSesion();
    
    // Configurar evento de logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }
    
    // Configurar botón de volver al inicio si existe
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener('click', function() {
            // RUTA CORREGIDA: Desde Modulo-Materias-Admin apunta a ../menu_inicio/menu_inicio_admin.html
            window.location.href = '../menu_inicio/menu_inicio_admin.html';
        });
    }
});

function inicializarMenu() {
    // Obtener todos los elementos del menú
    const menuItems = document.querySelectorAll('.menu-item[data-url]');
    
    // Agregar evento click a cada elemento del menú
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remover clase 'active' de todos los elementos
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Agregar clase 'active' al elemento clickeado
            this.classList.add('active');
            
            // Obtener la URL del data-url
            const url = this.getAttribute('data-url');
            if (url) {
                cargarFormulario(url);
            }
        });
    });
    
    // Cargar el formulario por defecto
    const activeItem = document.querySelector('.menu-item.active[data-url]');
    if (activeItem) {
        const url = activeItem.getAttribute('data-url');
        if (url) {
            cargarFormulario(url);
        }
    }
}

function cargarFormulario(url) {
    const iframe = document.getElementById('contenido-iframe');
    if (!iframe) return;
    
    // Mostrar indicador de carga
    iframe.style.opacity = '0.5';
    
    // Cargar el contenido en el iframe
    // RUTA CORREGIDA: Asumiendo que los HTML están en la misma carpeta (Modulo-Materias-Admin)
    iframe.src = url;
    
    // Restaurar opacidad cuando se cargue
    iframe.onload = function() {
        iframe.style.opacity = '1';
        
        // Enviar mensaje al iframe para notificar la carga
        try {
            iframe.contentWindow.postMessage({ 
                type: 'iframeLoaded',
                source: 'menu-principal',
                timestamp: new Date().toISOString()
            }, '*');
        } catch (e) {
            console.log('No se pudo comunicar con el iframe:', e);
        }
    };
    
    iframe.onerror = function() {
        console.error('Error al cargar:', url);
        iframe.innerHTML = `
            <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                <h3 style="color: #e74c3c;">
                    <i class="fas fa-exclamation-triangle"></i> Error al cargar el contenido
                </h3>
                <p>No se pudo cargar: ${url}</p>
                <button onclick="cargarFormulario('registrar_materia.html')" 
                        style="padding: 8px 16px; background-color: #3498db; color: white; 
                               border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                    <i class="fas fa-redo"></i> Volver al formulario principal
                </button>
            </div>
        `;
        iframe.style.opacity = '1';
    };
}

function verificarSesion() {
    // Verificar si hay una sesión activa
    // RUTA CORREGIDA: Dependiendo de dónde esté este archivo
    
    // Determinar ruta base basada en la ubicación actual
    let basePath = '';
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('Modulo-Materias-Admin') || 
        currentPath.includes('Menu_principal_materia')) {
        // Si estamos en módulo de materias
        basePath = '../APIS/login.api.js';
    } else if (currentPath.includes('publico') || 
               currentPath.includes('JS')) {
        // Si estamos en carpeta publico/JS
        basePath = '../APIS/login.api.js';
    } else {
        // Por defecto
        basePath = 'APIS/login.api.js';
    }
    
    fetch(`${basePath}/check`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!data.loggedIn) {
            // RUTA CORREGIDA: Redirigir al login
            window.location.href = '../Login/login.html';
            return;
        }
        
        // Verificar que sea admin
        if (data.user && data.user.tipo && data.user.tipo !== 'admin') {
            alert('Acceso denegado. Solo administradores pueden acceder a este módulo.');
            // RUTA CORREGIDA: Redirigir al menú admin
            window.location.href = '../menu_inicio/menu_inicio_admin.html';
            return;
        }
        
        // Mostrar nombre de usuario si existe el elemento
        const nombreUsuario = document.getElementById('nombre-usuario');
        if (nombreUsuario && data.user) {
            nombreUsuario.textContent = data.user.nombre || data.user.username || 'Usuario';
        }
    })
    .catch(error => {
        console.error('Error verificando sesión:', error);
        
        // Si estamos en desarrollo, permitir continuar
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('Modo desarrollo: Continuando sin verificación de sesión');
            
            // Simular usuario admin para desarrollo
            const nombreUsuario = document.getElementById('nombre-usuario');
            if (nombreUsuario) {
                nombreUsuario.textContent = 'Admin (Desarrollo)';
            }
        } else {
            // En producción, redirigir al login
            window.location.href = '../Login/login.html';
        }
    });
}

function cerrarSesion() {
    // Determinar ruta base
    let basePath = '../APIS/login.api.js';
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('Modulo-Materias-Admin') || 
        currentPath.includes('Menu_principal_materia')) {
        basePath = '../APIS/login.api.js';
    }
    
    fetch(`${basePath}/logout`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(() => {
        // RUTA CORREGIDA
        window.location.href = '../Login/login.html';
    })
    .catch(error => {
        console.error('Error al cerrar sesión:', error);
        // Redirigir de todos modos
        window.location.href = '../Login/login.html';
    });
}

// Función para manejar mensajes de iframes hijos
window.addEventListener('message', function(event) {
    // Aceptar mensajes de cualquier origen (en desarrollo)
    // En producción, deberías verificar event.origin
    
    console.log('Mensaje recibido desde iframe:', event.data);
    
    if (event.data.type === 'materiaRegistrada') {
        // Mostrar notificación cuando se registre una materia
        mostrarNotificacion(`${event.data.message}`, 'success');
    }
    
    if (event.data.type === 'materiaEliminada') {
        // Mostrar notificación cuando se elimine una materia
        mostrarNotificacion(` ${event.data.message}`, 'info');
    }
    
    if (event.data.type === 'error') {
        // Mostrar notificación de error
        mostrarNotificacion(` ${event.data.message}`, 'error');
    }
});

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    
    // Estilos según tipo
    const estilos = {
        success: {
            backgroundColor: '#2ecc71',
            icon: 'fa-check-circle'
        },
        error: {
            backgroundColor: '#e74c3c',
            icon: 'fa-exclamation-circle'
        },
        info: {
            backgroundColor: '#3498db',
            icon: 'fa-info-circle'
        },
        warning: {
            backgroundColor: '#f39c12',
            icon: 'fa-exclamation-triangle'
        }
    };
    
    const estilo = estilos[tipo] || estilos.info;
    
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${estilo.backgroundColor};
        color: white;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    
    notificacion.innerHTML = `
        <i class="fas ${estilo.icon}"></i>
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()" 
                style="background:none; border:none; color:white; margin-left:10px; cursor:pointer; font-size: 16px;">
            ×
        </button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

// Agregar estilos CSS para animaciones si no existen
if (!document.querySelector('#materias-menu-styles')) {
    const style = document.createElement('style');
    style.id = 'materias-menu-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .menu-item {
            transition: all 0.3s ease;
            position: relative;
            cursor: pointer;
        }
        
        .menu-item:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .menu-item.active {
            background-color: rgba(52, 152, 219, 0.8);
        }
        
        .menu-item.active::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 60%;
            background-color: white;
            border-radius: 2px 0 0 2px;
        }
    `;
    document.head.appendChild(style);
}

// Exportar funciones para uso global
window.cargarFormulario = cargarFormulario;
window.verificarSesion = verificarSesion;
window.cerrarSesion = cerrarSesion;
window.mostrarNotificacion = mostrarNotificacion;