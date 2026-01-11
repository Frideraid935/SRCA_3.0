document.addEventListener('DOMContentLoaded', () => {

    const items = document.querySelectorAll('.menu-item');
    const iframe = document.getElementById('iframe-contenido');

    items.forEach(item => {
        item.addEventListener('click', () => {

            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const form = item.getAttribute('data-form');

            if (form) {
                iframe.src = `${form}.html`;
            }
        });
    });

    // Botón regresar al menú principal
    document.getElementById('btn-inicio')?.addEventListener('click', () => {
        window.location.href = '../menu_inicio/menu_inicio_admin.html';
    });
});
