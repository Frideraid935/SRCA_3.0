document.addEventListener("DOMContentLoaded", () => {

    const menuItems = document.querySelectorAll(".menu-item[data-url]");
    const iframe = document.getElementById("contenido-iframe");
    const btnInicio = document.getElementById("btn-inicio");

    /* ===============================
       CAMBIO DE FORMULARIOS
    ================================ */
    menuItems.forEach(item => {
        item.addEventListener("click", () => {

            // Quitar activo a todos
            menuItems.forEach(i => i.classList.remove("active"));

            // Activar el actual
            item.classList.add("active");

            // Cargar formulario en iframe
            const url = item.getAttribute("data-url");
            iframe.src = url;
        });
    });

    /* ===============================
       REGRESAR AL MENÚ PRINCIPAL
    ================================ */
    btnInicio.addEventListener("click", () => {
        window.location.href = "../menu_inicio/menu_inicio_admin.html";
    });

});
