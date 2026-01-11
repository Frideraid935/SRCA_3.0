// profesores-menu.js - Solo para el menú lateral
document.addEventListener('DOMContentLoaded', function() {
    console.log('Menú de profesores cargado');
    
    // Elementos del DOM
    const menuItems = document.querySelectorAll('.menu-item[data-form]');
    const iframe = document.getElementById('iframe-contenido');
    
    if (!iframe) return;
    
    // Función para cargar contenido en el iframe
    function cargarContenido(formulario) {
        iframe.src = formulario + '.html';
    }
    
    // Configurar eventos para los items del menú
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Cargar contenido en iframe
            const formulario = this.getAttribute('data-form');
            cargarContenido(formulario);
        });
    });
    
    // Botón de inicio
    const btnInicio = document.getElementById('btn-inicio');
    if (btnInicio) {
        btnInicio.addEventListener('click', function() {
            window.location.href = '../menu_inicio/menu_inicio_admin.html';
        });
    }
    
    // Cargar formulario inicial (Registrar por defecto)
    const activeItem = document.querySelector('.menu-item.active[data-form]') || 
                       document.querySelector('.menu-item[data-form]');
    
    if (activeItem) {
        const formulario = activeItem.getAttribute('data-form');
        cargarContenido(formulario);
    }
});