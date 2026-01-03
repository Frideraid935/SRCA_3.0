document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('contenido-iframe');
    const items = document.querySelectorAll('.menu-item');
    const btnInicio = document.getElementById('btn-inicio');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');

            if (!url) return;

            // Cambiar iframe
            iframe.src = url;

            // Marcar activo
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Regresar al menú principal
    btnInicio.addEventListener('click', () => {
        window.location.href = '../Menu_inicio/inicio_Admin.html';
    });
});
