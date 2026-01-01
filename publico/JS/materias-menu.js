// publico/JS/materias-menu.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('Materias Menu - Inicializando...');
    
    // Primero inicializar el menú
    inicializarMenu();
    
    // Luego verificar sesión (pero sin redireccionar inmediatamente en desarrollo)
    verificarSesionConTolerancia();
    
    // Configurar eventos
    configurarEventos();
});

function configurarEventos() {
    // Configurar evento de logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }
    
    // Configurar botón de volver al inicio si existe
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener('click', function() {
            window.location.href = '../menu_inicio/menu_inicio_admin.html';
        });
    }
}

function inicializarMenu() {
    console.log('Inicializando menú...');
    
    // Obtener todos los elementos del menú
    const menuItems = document.querySelectorAll('.menu-item[data-url]');
    
    if (menuItems.length === 0) {
        console.warn('No se encontraron elementos de menú con data-url');
        return;
    }
    
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
                console.log('Cargando formulario:', url);
                cargarFormulario(url);
            }
        });
    });
    
    // Cargar el formulario por defecto
    const activeItem = document.querySelector('.menu-item.active[data-url]');
    if (activeItem) {
        const url = activeItem.getAttribute('data-url');
        if (url) {
            console.log('Cargando formulario por defecto:', url);
            cargarFormulario(url);
        }
    } else if (menuItems.length > 0) {
        // Si no hay activo, activar el primero
        menuItems[0].classList.add('active');
        const url = menuItems[0].getAttribute('data-url');
        if (url) {
            cargarFormulario(url);
        }
    }
}

function cargarFormulario(url) {
    const iframe = document.getElementById('contenido-iframe');
    if (!iframe) {
        console.error('No se encontró el iframe con id "contenido-iframe"');
        return;
    }
    
    console.log('Cargando URL en iframe:', url);
    
    // Mostrar indicador de carga
    iframe.style.opacity = '0.5';
    
    // Cargar el contenido en el iframe
    iframe.src = url;
    
    // Restaurar opacidad cuando se cargue
    iframe.onload = function() {
        iframe.style.opacity = '1';
        console.log('Iframe cargado exitosamente');
        
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
        console.error('Error al cargar el iframe:', url);
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

function verificarSesionConTolerancia() {
    console.log('Verificando sesión con tolerancia...');
    
    // Determinar si estamos en desarrollo
    const esDesarrollo = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '';
    
    if (esDesarrollo) {
        console.log('Modo desarrollo activado - Sesión tolerada');
        
        // En desarrollo, establecer usuario por defecto
        const nombreUsuario = document.getElementById('nombre-usuario');
        if (nombreUsuario) {
            nombreUsuario.textContent = 'Administrador (Modo Desarrollo)';
        }
        
        // Intentar verificar sesión pero no redirigir si falla
        verificarSesion(false); // false = no redirigir automáticamente
    } else {
        // En producción, verificar normalmente
        verificarSesion(true); // true = redirigir si falla
    }
}

function verificarSesion(redirigirSiFalla = true) {
    console.log('Verificando sesión, redirigirSiFalla:', redirigirSiFalla);
    
    // Intentar diferentes rutas posibles
    const rutasPosibles = [
        '/api/login/check',
        '../APIS/login.api.js/check',
        'APIS/login.api.js/check',
        '../../APIS/login.api.js/check'
    ];
    
    // Función recursiva para probar rutas
    const probarRuta = (index) => {
        if (index >= rutasPosibles.length) {
            console.log('Todas las rutas fallaron');
            
            if (redirigirSiFalla) {
                console.log('Redirigiendo a login...');
                window.location.href = '../Login/login.html';
            }
            return;
        }
        
        const ruta = rutasPosibles[index];
        console.log(`Probando ruta ${index + 1}/${rutasPosibles.length}: ${ruta}`);
        
        fetch(ruta, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log(`Respuesta de ${ruta}: Status ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            console.log('Datos de sesión recibidos:', data);
            
            if (data.loggedIn) {
                console.log('Sesión activa - Usuario:', data.user);
                
                // Verificar que sea admin
                if (data.user && data.user.tipo && data.user.tipo !== 'admin') {
                    console.warn('Usuario no es administrador');
                    if (redirigirSiFalla) {
                        alert('Acceso denegado. Solo administradores pueden acceder a este módulo.');
                        window.location.href = '../menu_inicio/menu_inicio_admin.html';
                    }
                    return;
                }
                
                // Mostrar nombre de usuario
                const nombreUsuario = document.getElementById('nombre-usuario');
                if (nombreUsuario && data.user) {
                    nombreUsuario.textContent = data.user.nombre || data.user.username || 'Administrador';
                }
            } else {
                console.log('No hay sesión activa');
                if (redirigirSiFalla) {
                    window.location.href = '../Login/login.html';
                }
            }
        })
        .catch(error => {
            console.error(`Error con ruta ${ruta}:`, error.message);
            
            // Intentar con la siguiente ruta
            setTimeout(() => probarRuta(index + 1), 100);
        });
    };
    
    // Comenzar con la primera ruta
    probarRuta(0);
}

function cerrarSesion() {
    console.log('Cerrando sesión...');
    
    // Intentar diferentes rutas para logout
    const rutasLogout = [
        '/api/logout',
        '../APIS/login.api.js/logout',
        'APIS/login.api.js/logout'
    ];
    
    const intentarLogout = (index) => {
        if (index >= rutasLogout.length) {
            console.log('Todas las rutas de logout fallaron, redirigiendo de todos modos');
            window.location.href = '../Login/login.html';
            return;
        }
        
        const ruta = rutasLogout[index];
        console.log(`Intentando logout con ruta: ${ruta}`);
        
        fetch(ruta, {
            method: 'GET',
            credentials: 'include'
        })
        .then(() => {
            console.log('Logout exitoso');
            window.location.href = '../Login/login.html';
        })
        .catch(error => {
            console.error(`Error con logout ruta ${ruta}:`, error.message);
            
            if (index === rutasLogout.length - 1) {
                // Última ruta falló, redirigir de todos modos
                window.location.href = '../Login/login.html';
            } else {
                // Intentar con la siguiente ruta
                setTimeout(() => intentarLogout(index + 1), 100);
            }
        });
    };
    
    intentarLogout(0);
}

// Función para manejar mensajes de iframes hijos
window.addEventListener('message', function(event) {
    console.log('Mensaje recibido desde iframe:', event.data);
    
    // Verificar el origen si es necesario (en producción deberías verificar event.origin)
    
    if (event.data.type === 'materiaRegistrada') {
        mostrarNotificacion(` ${event.data.message}`, 'success');
    }
    
    if (event.data.type === 'materiaEliminada') {
        mostrarNotificacion(` ${event.data.message}`, 'info');
    }
    
    if (event.data.type === 'error') {
        mostrarNotificacion(` ${event.data.message}`, 'error');
    }
    
    if (event.data.type === 'necesitaSesion') {
        console.log('Iframe reporta que necesita sesión');
        verificarSesion(true); // Forzar verificación con redirección
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

// Función de emergencia para desactivar verificación
window.desactivarVerificacionSesion = function() {
    console.log('Verificación de sesión desactivada manualmente');
    const nombreUsuario = document.getElementById('nombre-usuario');
    if (nombreUsuario) {
        nombreUsuario.textContent = 'Admin (Verificación desactivada)';
    }
};

console.log('Materias Menu - Cargado exitosamente');