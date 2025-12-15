document.getElementById("login").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const contraseña = document.getElementById("contraseña").value;

  try {
    const response = await fetch("../APIS/login.api.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, contraseña })
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = "/menu_inicio/menu_inicio_admin.html";
    } else {
      alert("Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con el servidor");
  }
});
