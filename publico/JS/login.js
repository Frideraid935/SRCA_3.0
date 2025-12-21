document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");

  if (!form) {
    console.error("No se encontró el formulario con id loginForm");
    return;
  }

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario, password })
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      const data = await response.json();

      if (data.success === true) {
        window.location.href = "/menu_inicio/menu_inicio_admin.html";
      } else {
        alert(data.message || "Credenciales incorrectas");
      }

    } catch (error) {
      console.error("Error en login:", error);
      alert("No se pudo conectar con el servidor");
    }
  });

});
