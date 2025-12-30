document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password })
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      if (data.rol === "admin") {
        window.location.href = "/menu_inicio/menu_inicio_admin.html";
      } else if (data.rol === "alumno") {
        window.location.href = "/menu_inicio/menu_inicio_alumno.html";
      } else if (data.rol === "profesor") {
        window.location.href = "/menu_inicio/menu_inicio_profe.html";
      }

    } catch (error) {
      alert("Error de conexión");
    }
  });
});
