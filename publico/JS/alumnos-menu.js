document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu-item[data-form]");
  const iframe = document.getElementById("iframe-contenido");
  const btnInicio = document.getElementById("btn-inicio");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      const form = item.getAttribute("data-form");
      iframe.src = `/Modulo-Alumno-Profesores-Admin/${form}.html`;
    });
  });

  btnInicio.addEventListener("click", () => {
    window.location.href = "/menu_inicio/menu_inicio_admin.html";
  });
});
