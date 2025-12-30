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

      // Cargar HTML en iframe (RUTA ABSOLUTA)
      const form = item.dataset.form;
      iframe.src = `/Modulo-Alumno-Profesores-Admin/${form}.html`;
    });
  });

  // Botón menú principal
  if (btnInicio) {
    btnInicio.addEventListener("click", () => {
      window.location.href = "/menu_principal_alumnos.html";
    });
  }
});
