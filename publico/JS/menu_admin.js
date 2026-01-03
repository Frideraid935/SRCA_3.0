// publico/JS/menu-admin.js

// Configuración de rutas
const ADMIN_BASE_PATH = '../Admin/';

// Función principal cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Menú de administradores cargado');
    
    // Configurar eventos de los items del menú
    configurarMenu();
    
    // Configurar el iframe para que se ajuste al contenido
    configurarIframe();
    
    // Cargar la página por defecto (Registrar Admin)
    cargarPaginaPorDefecto();
});

// Configurar eventos del menú
function configurarMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        // Remover eventos anteriores
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Agregar nuevo evento
        newItem.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = this.getAttribute('data-url') || 
                       this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            
            if (url) {
                cargarPagina(url);
                actualizarMenuActivo(this);
            }
        });
    });
}

// Cargar página en el iframe
function cargarPagina(url) {
    const iframe = document.getElementById('contenido-iframe');
    
    if (!iframe) {
        console.error('Iframe no encontrado');
        window.location.href = url; // Fallback
        return;
    }
    
    console.log('Cargando página:', url);
    
    // Mostrar indicador de carga
    mostrarCargando();
    
    // Cargar la página
    iframe.src = url;
    
    // Ajustar altura después de cargar
    iframe.onload = function() {
        ajustarAlturaIframe();
        ocultarCargando();
    };
    
    // Manejar errores
    iframe.onerror = function() {
        console.error('Error al cargar:', url);
        ocultarCargando();
        alert('Error al cargar la página: ' + url);
    };
}

// Cargar página por defecto
function cargarPaginaPorDefecto() {
    const defaultUrl = 'Admin_registrar.html';
    const defaultMenuItem = document.querySelector('.menu-item[data-url*="registrar"]') || 
                           document.querySelector('.menu-item');
    
    if (defaultMenuItem) {
        cargarPagina(defaultUrl);
        actualizarMenuActivo(defaultMenuItem);
    }
}

// Actualizar item activo del menú
function actualizarMenuActivo(itemSeleccionado) {
    // Remover clase active de todos los items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al item seleccionado
    itemSeleccionado.classList.add('active');
}

// Ajustar altura del iframe según su contenido
function ajustarAlturaIframe() {
    const iframe = document.getElementById('contenido-iframe');
    
    if (!iframe || !iframe.contentWindow) {
        return;
    }
    
    try {
        // Esperar un poco para que el contenido se renderice
        setTimeout(() => {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            if (!iframeDoc || !iframeDoc.body) {
                return;
            }
            
            // Calcular altura del contenido
            const body = iframeDoc.body;
            const html = iframeDoc.documentElement;
            
            const height = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            );
            
            // Ajustar altura del iframe
            iframe.style.height = (height + 20) + 'px'; // +20px de margen
            
            console.log('Altura ajustada a:', height + 'px');
        }, 100);
    } catch (error) {
        console.warn('No se pudo ajustar la altura del iframe:', error);
    }
}

// Mostrar indicador de carga
function mostrarCargando() {
    // Puedes implementar un spinner o mensaje de carga aquí
    console.log('Cargando...');
}

// Ocultar indicador de carga
function ocultarCargando() {
    console.log('Carga completada');
}

// Configurar el iframe
function configurarIframe() {
    const iframe = document.getElementById('contenido-iframe');
    
    if (!iframe) {
        return;
    }
    
    // Configurar eventos de ajuste de altura
    iframe.addEventListener('load', ajustarAlturaIframe);
    
    // Ajustar altura periódicamente (por si hay contenido dinámico)
    setInterval(ajustarAlturaIframe, 1000);
    
    // Manejar clicks dentro del iframe que puedan necesitar ajuste
    iframe.contentWindow?.addEventListener?.('resize', ajustarAlturaIframe);
    iframe.contentWindow?.addEventListener?.('DOMContentLoaded', ajustarAlturaIframe);
}

// Exportar funciones para uso global
window.cargarPagina = cargarPagina;
window.ajustarAlturaIframe = ajustarAlturaIframe;