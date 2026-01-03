// publico/JS/menu_admin.js

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Menú lateral cargado');
    
    // Configurar los enlaces del menú
    configurarMenu();
    
    // Cargar la página inicial
    cargarPaginaInicial();
});

function configurarMenu() {
    // Seleccionar todos los enlaces del menú
    const enlacesMenu = document.querySelectorAll('.menu-item');
    
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar comportamiento por defecto
            
            const url = this.getAttribute('data-url');
            console.log('URL del menú:', url);
            
            if (url) {
                // Cargar la página en el iframe
                cargarPagina(url, this);
            }
        });
    });
}

function cargarPagina(url, elementoMenu) {
    const iframe = document.getElementById('contenido-iframe');
    
    if (!iframe) {
        console.error('No se encontró el iframe');
        // Si no hay iframe, navegar directamente
        window.location.href = url;
        return;
    }
    
    console.log('Cargando en iframe:', url);
    
    // Actualizar menú activo
    if (elementoMenu) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        elementoMenu.classList.add('active');
    }
    
    // Cargar la página en el iframe
    iframe.src = url;
}

function cargarPaginaInicial() {
    // Por defecto cargar la página de registro
    const urlInicial = 'Registrar_admin.html';
    const primerEnlace = document.querySelector('.menu-item[data-url="Registrar_admin.html"]');
    
    cargarPagina(urlInicial, primerEnlace);
}