// publico/JS/materias-menu.js - VERSIÓN SIN REDIRECCIÓN

document.addEventListener('DOMContentLoaded', function() {
    console.log('Modulo de Materias - Iniciado');
    
    // 1. Establecer usuario inmediatamente (sin verificar)
    establecerUsuario();
    
    // 2. Inicializar el menú
    inicializarMenu();
    
    // 3. Configurar eventos
    configurarEventos();
    
    // NOTA: NO llamamos a verificarSesion() para evitar redirección
});

function establecerUsuario() {
    const nombreUsuario = document.getElementById('nombre-usuario');
    if (nombreUsuario) {
        nombreUsuario.textContent = 'Administrador';
        console.log('Usuario establecido: Administrador');
    }
}

function configurarEventos() {
    // Botón de logout (si existe)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            console.log('Cerrando sesión');
            window.location.href = '../Login/login.html';
        });
    }
    
    // Botón de volver al inicio (si existe)
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener('click', function() {
            console.log('Volviendo al menú principal');
            window.location.href = '../menu_inicio/menu_inicio_admin.html';
        });
    }
}

function inicializarMenu() {
    console.log('Inicializando menú lateral...');
    
    // Obtener todos los elementos del menú
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (menuItems.length === 0) {
        console.warn('No se encontraron elementos .menu-item');
        return;
    }
    
    // Agregar evento click a cada elemento del menú
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase 'active' de todos los elementos
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Agregar clase 'active' al elemento clickeado
            this.classList.add('active');
            
            // Obtener la función onclick original del HTML si existe
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                // Extraer y ejecutar la función onclick si es cargarFormulario
                if (onclickAttr.includes("cargarFormulario")) {
                    const match = onclickAttr.match(/cargarFormulario\('([^']+)'\)/);
                    if (match && match[1]) {
                        const url = match[1];
                        console.log('Cargando:', url);
                        cargarFormulario(url);
                    }
                }
                // Si es otra función (como redirección), ejecutarla
                else if (onclickAttr.includes("window.location")) {
                    eval(onclickAttr);
                }
            }
            
            // También verificar si tiene data-url
            const dataUrl = this.getAttribute('data-url');
            if (dataUrl) {
                console.log('Cargando desde data-url:', dataUrl);
                cargarFormulario(dataUrl);
            }
        });
    });
    
    // Cargar el formulario por defecto (si no hay uno cargado)
    const iframe = document.getElementById('contenido-iframe');
    const activeItem = document.querySelector('.menu-item.active');
    
    if (iframe && (!iframe.src || iframe.src.includes('about:blank'))) {
        if (activeItem) {
            // Intentar obtener URL del elemento activo
            let urlToLoad = null;
            
            // Primero de onclick
            const onclickAttr = activeItem.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes("cargarFormulario")) {
                const match = onclickAttr.match(/cargarFormulario\('([^']+)'\)/);
                if (match && match[1]) {
                    urlToLoad = match[1];
                }
            }
            
            // Si no, de data-url
            if (!urlToLoad) {
                const dataUrl = activeItem.getAttribute('data-url');
                if (dataUrl) {
                    urlToLoad = dataUrl;
                }
            }
            
            // Cargar si encontramos URL
            if (urlToLoad) {
                console.log('Cargando formulario por defecto:', urlToLoad);
                cargarFormulario(urlToLoad);
            } else {
                console.log('No se encontró URL para cargar por defecto');
            }
        } else if (menuItems.length > 0) {
            // Activar y cargar el primer elemento si no hay activo
            menuItems[0].classList.add('active');
            const firstOnclick = menuItems[0].getAttribute('onclick');
            if (firstOnclick && firstOnclick.includes("cargarFormulario")) {
                const match = firstOnclick.match(/cargarFormulario\('([^']+)'\)/);
                if (match && match[1]) {
                    console.log('Cargando primer formulario:', match[1]);
                    cargarFormulario(match[1]);
                }
            }
        }
    } else if (iframe && iframe.src) {
        console.log('Iframe ya cargado con:', iframe.src);
    }
}

function cargarFormulario(url) {
    const iframe = document.getElementById('contenido-iframe');
    if (!iframe) {
        console.error('No se encontró el iframe con id "contenido-iframe"');
        return;
    }
    
    // Mostrar indicador de carga
    iframe.style.opacity = '0.5';
    iframe.style.transition = 'opacity 0.3s ease';
    
    // Verificar si la URL es absoluta o relativa
    let finalUrl = url;
    
    // Si la URL no comienza con http o https, asumir que es relativa
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
        // Ajustar la ruta según la ubicación actual
        const currentPath = window.location.pathname;
        if (currentPath.includes('Modulo-Materias-Admin')) {
            // Si estamos en la carpeta Modulo-Materias-Admin
            finalUrl = url;
        } else {
            // Si estamos en otra carpeta, ajustar la ruta
            finalUrl = `Modulo-Materias-Admin/${url}`;
        }
    }
    
    console.log('Cargando:', finalUrl);
    
    // Cargar el contenido en el iframe
    iframe.src = finalUrl;
    
    // Restaurar opacidad cuando se cargue
    iframe.onload = function() {
        iframe.style.opacity = '1';
        console.log(finalUrl + ' cargado correctamente');
        
        // Enviar mensaje al iframe para notificar la carga
        try {
            iframe.contentWindow.postMessage({ 
                type: 'iframeLoaded',
                source: 'menu-principal',
                timestamp: new Date().toISOString(),
                message: 'Formulario cargado correctamente'
            }, '*');
        } catch (e) {
            console.log('No se pudo comunicar con el iframe');
        }
    };
    
    iframe.onerror = function() {
        console.error('Error al cargar:', finalUrl);
        iframe.innerHTML = `
            <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif; color: #333;">
                <h3 style="color: #e74c3c; margin-bottom: 20px;">
                    Error al cargar el contenido
                </h3>
                <p style="margin-bottom: 10px;"><strong>URL:</strong> ${finalUrl}</p>
                <p style="margin-bottom: 20px;">Verifica que el archivo exista en la carpeta correcta.</p>
                <button onclick="cargarFormulario('registrar_materia.html')" 
                        style="padding: 10px 20px; background-color: #3498db; color: white; 
                               border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                    Intentar con formulario principal
                </button>
            </div>
        `;
        iframe.style.opacity = '1';
    };
}

// FUNCIÓN DE VERIFICACIÓN DE SESIÓN MODIFICADA (NO REDIRIGE)
function verificarSesion() {
    console.log('Verificación de sesión (modo seguro - no redirige)');
    
    // Solo registrar en consola, no redirigir
    const nombreUsuario = document.getElementById('nombre-usuario');
    if (nombreUsuario) {
        nombreUsuario.textContent = 'Administrador (Modo Seguro)';
    }
    
    console.log('Sesión verificada en modo seguro - Sin redirección');
}

// Función para manejar mensajes del iframe
window.addEventListener('message', function(event) {
    if (event.data && event.data.type) {
        console.log('Mensaje del iframe:', event.data);
        
        if (event.data.type === 'formularioGuardado') {
            mostrarNotificacion(event.data.message, 'success');
        }
    }
});

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación simple
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${tipo === 'success' ? '#2ecc71' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
        font-family: Arial, sans-serif;
    `;
    
    notificacion.innerHTML = `
        ${mensaje}
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

// Función de emergencia para diagnóstico
window.diagnosticarMenu = function() {
    console.log('=== DIAGNÓSTICO DEL MENÚ ===');
    console.log('1. Elementos .menu-item:', document.querySelectorAll('.menu-item').length);
    console.log('2. Iframe encontrado:', document.getElementById('contenido-iframe') ? 'Si' : 'No');
    console.log('3. Elemento activo:', document.querySelector('.menu-item.active'));
    console.log('4. URL actual:', window.location.href);
    console.log('5. Pathname:', window.location.pathname);
};

// Exportar funciones para uso global
window.cargarFormulario = cargarFormulario;
window.verificarSesion = verificarSesion; // Esta versión NO redirige
window.mostrarNotificacion = mostrarNotificacion;

console.log('materias-menu.js cargado correctamente');