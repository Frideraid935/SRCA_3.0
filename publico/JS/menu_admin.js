// publico/JS/menu_admin.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('Menú de administradores cargado');
    
    // Inicializar el sistema
    inicializarMenu();
});

function inicializarMenu() {
    // 1. Configurar eventos del menú lateral
    configurarMenuLateral();
    
    // 2. Cargar página inicial
    cargarPaginaInicial();
    
    // 3. Configurar iframe
    configurarIframe();
}

function configurarMenuLateral() {
    const menuItems = document.querySelectorAll('.menu-item[data-url]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = this.getAttribute('data-url');
            if (url) {
                console.log('Cargando página:', url);
                
                // Actualizar menú activo
                actualizarMenuActivo(this);
                
                // Cargar página en el iframe
                cargarPaginaEnIframe(url);
            }
        });
    });
}

function cargarPaginaInicial() {
    // Cargar Registrar_admin.html por defecto
    const urlInicial = 'Registrar_admin.html';
    cargarPaginaEnIframe(urlInicial);
    
    // Marcar como activo el primer item
    const primerItem = document.querySelector('.menu-item[data-url="Registrar_admin.html"]');
    if (primerItem) {
        actualizarMenuActivo(primerItem);
    }
}

function actualizarMenuActivo(itemSeleccionado) {
    // Remover clase active de todos los items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al item seleccionado
    itemSeleccionado.classList.add('active');
}

function cargarPaginaEnIframe(url) {
    const iframe = document.getElementById('contenido-iframe');
    
    if (!iframe) {
        console.error('Error: Iframe no encontrado');
        window.location.href = url; // Fallback
        return;
    }
    
    console.log('Cargando URL en iframe:', url);
    
    // Mostrar estado de carga
    mostrarEstadoCarga();
    
    // Cargar la página
    iframe.src = url;
    
    // Configurar eventos del iframe
    iframe.onload = function() {
        console.log('Página cargada exitosamente');
        ajustarAlturaIframe();
    };
    
    iframe.onerror = function() {
        console.error('Error al cargar la página:', url);
        mostrarErrorCarga(url);
    };
}

function mostrarEstadoCarga() {
    const iframe = document.getElementById('contenido-iframe');
    if (!iframe) return;
    
    // Crear contenido de carga temporal
    const contenidoCarga = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #f8f9fa;
                    font-family: Arial, sans-serif;
                }
                .loading {
                    text-align: center;
                    color: #6c757d;
                }
                .spinner {
                    display: inline-block;
                    width: 50px;
                    height: 50px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="loading">
                <div class="spinner"></div>
                <p>Cargando...</p>
            </div>
        </body>
        </html>
    `;
    
    // Usar srcdoc para mostrar contenido de carga
    iframe.srcdoc = contenidoCarga;
}

function mostrarErrorCarga(url) {
    const iframe = document.getElementById('contenido-iframe');
    if (!iframe) return;
    
    const contenidoError = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 40px;
                    font-family: Arial, sans-serif;
                    background: #f8f9fa;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .error-container {
                    text-align: center;
                    max-width: 400px;
                    padding: 30px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .error-icon {
                    color: #dc3545;
                    font-size: 48px;
                    margin-bottom: 20px;
                }
                .error-title {
                    color: #dc3545;
                    margin-bottom: 15px;
                }
                .error-message {
                    color: #6c757d;
                    margin-bottom: 25px;
                    line-height: 1.5;
                }
                .retry-button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .retry-button:hover {
                    background: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="error-title">Error al cargar</h3>
                <p class="error-message">
                    No se pudo cargar la página.<br>
                    Archivo: ${url}
                </p>
                <button class="retry-button" onclick="window.parent.reintentarCarga('${url}')">
                    Reintentar
                </button>
            </div>
        </body>
        </html>
    `;
    
    iframe.srcdoc = contenidoError;
}

function configurarIframe() {
    const iframe = document.getElementById('contenido-iframe');
    
    if (!iframe) return;
    
    // Ajustar altura cuando cambie el contenido
    iframe.addEventListener('load', function() {
        setTimeout(ajustarAlturaIframe, 100);
    });
    
    // Ajustar altura periódicamente
    setInterval(ajustarAlturaIframe, 2000);
    
    // Ajustar cuando cambia el tamaño de la ventana
    window.addEventListener('resize', ajustarAlturaIframe);
}

function ajustarAlturaIframe() {
    const iframe = document.getElementById('contenido-iframe');
    
    if (!iframe) return;
    
    try {
        // Intentar acceder al documento del iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        if (iframeDoc && iframeDoc.body) {
            // Calcular altura del contenido
            const height = Math.max(
                iframeDoc.body.scrollHeight,
                iframeDoc.body.offsetHeight,
                iframeDoc.documentElement.scrollHeight,
                iframeDoc.documentElement.offsetHeight,
                iframeDoc.documentElement.clientHeight
            );
            
            // Ajustar altura del iframe
            iframe.style.height = (height + 50) + 'px'; // Margen adicional
            
            console.log('Iframe ajustado a altura:', height + 'px');
        }
    } catch (error) {
        // Error de seguridad cross-origin
        console.log('No se puede acceder al contenido del iframe (cross-origin)');
        
        // Establecer altura por defecto
        iframe.style.height = '800px';
    }
}

// Función para reintentar carga (llamada desde el iframe)
window.reintentarCarga = function(url) {
    console.log('Reintentando carga de:', url);
    cargarPaginaEnIframe(url);
};

// Función para que las páginas dentro del iframe puedan notificar cambios
window.notificarCambioContenido = function() {
    console.log('Contenido cambiado, ajustando altura...');
    ajustarAlturaIframe();
};

// Ajustar altura cuando se carga completamente la página
window.addEventListener('load', function() {
    setTimeout(ajustarAlturaIframe, 500);
});