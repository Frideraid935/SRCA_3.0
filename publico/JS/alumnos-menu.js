document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu-item[data-form]");
  const iframe = document.getElementById("iframe-contenido");
  const btnInicio = document.getElementById("btn-inicio");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      // Quitar activo a todos
      menuItems.forEach(i => i.classList.remove("active"));

      // Activar el actual
      item.classList.add("active");

      // Cargar el HTML correspondiente en el iframe
      const form = item.getAttribute("data-form");
      iframe.src = `${form}.html`;
    });
  });

  // Botón menú principal
  btnInicio.addEventListener("click", () => {
    window.location.href = "/"; // o a tu dashboard principal
  });
});
