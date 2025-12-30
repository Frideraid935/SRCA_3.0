document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item[data-form]');
    const iframe = document.getElementById('iframe-contenido');
    const btnInicio = document.getElementById('btn-inicio');
    
    if (!iframe) return;
    
    // Navegación entre módulos
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover active de todos
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Agregar active al seleccionado
            this.classList.add('active');
            
            // Cargar el formulario correspondiente
            const formName = this.getAttribute('data-form');
            iframe.src = `/Modulo-Alumno-Profesores-Admin/${formName}.html`;
        });
    });
    
    // Botón para regresar al inicio
    if (btnInicio) {
        btnInicio.addEventListener('click', function() {
            window.location.href = '/menu_inicio/menu_inicio_admin.html';
        });
    }
});