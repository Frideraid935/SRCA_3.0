document.addEventListener("DOMContentLoaded", () => {
  console.log(" alumnos.js cargado correctamente");

  /* ===============================
     REGISTRAR ALUMNO
  ================================ */
  const formRegistrar = document.getElementById("formulario-registrar");
  if (formRegistrar) {
    formRegistrar.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = obtenerDatosAlumno();
      const res = await fetch("/api/alumnos/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      mostrarMensaje("mensaje-registro", result.message);
      if (result.status === "success") formRegistrar.reset();
    });
  }

  /* ===============================
     BUSCAR / LISTAR ALUMNOS
  ================================ */
  const formBuscar = document.getElementById("formulario-buscar");
  if (formBuscar) {
    formBuscar.addEventListener("submit", async (e) => {
      e.preventDefault();

      const numero = document.getElementById("numero_de_control").value;

      const res = await fetch("/api/alumnos/listar");
      const alumnos = await res.json();

      const alumno = alumnos.find(a => a.numero_de_control == numero);
      const contenedor = document.getElementById("datos-alumno");

      if (!alumno) {
        contenedor.style.display = "block";
        contenedor.innerHTML = "<p> Alumno no encontrado</p>";
        return;
      }

      contenedor.style.display = "block";
      contenedor.innerHTML = `
        <p><strong>Nombre:</strong> ${alumno.nombre}</p>
        <p><strong>Número de control:</strong> ${alumno.numero_de_control}</p>
        <p><strong>Fecha nacimiento:</strong> ${alumno.fecha_nacimiento}</p>
      `;

      // Para actualizar
      const inputActualizar = document.getElementById("numero_de_control_actualizar");
      if (inputActualizar) {
        inputActualizar.value = alumno.numero_de_control;
        document.getElementById("formulario-actualizar").style.display = "block";
      }
    });
  }

  /* ===============================
     ACTUALIZAR ALUMNO
  ================================ */
  const formActualizar = document.getElementById("formulario-actualizar");
  if (formActualizar) {
    formActualizar.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = obtenerDatosAlumno(true);

      const res = await fetch("/api/alumnos/actualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      mostrarMensaje("mensaje-actualizar", result.message);
    });
  }

  /* ===============================
     ELIMINAR ALUMNO
  ================================ */
  const formEliminar = document.getElementById("formulario-eliminar");
  if (formEliminar) {
    formEliminar.addEventListener("submit", async (e) => {
      e.preventDefault();

      const numero = document.getElementById("numero_de_control").value;

      if (!confirm("¿Seguro que deseas eliminar este alumno?")) return;

      const res = await fetch("/api/alumnos/eliminar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero_de_control: numero })
      });

      const result = await res.json();
      mostrarMensaje("mensaje-eliminar", result.message);

      document.getElementById("datos-alumno").style.display = "none";
      formEliminar.reset();
    });
  }

});

/* ===============================
   FUNCIONES AUXILIARES
================================ */

function obtenerDatosAlumno(esActualizar = false) {
  const get = id => document.getElementById(id)?.value || "";

  return {
    numero_de_control: esActualizar
      ? get("numero_de_control_actualizar")
      : get("numero_de_control"),
    nombre: get("nombre"),
    fecha_nacimiento: get("fecha_nacimiento"),
    curso: get("curso"),
    poblacion: get("poblacion"),
    direccion: get("direccion"),
    email: get("email"),
    telefonos: get("telefonos"),
    curp: get("curp"),
    estatus: get("estatus"),
    alergico: get("alergico"),
    contacto_accidente: get("contacto_accidente"),
    telefonos_contacto: get("telefonos_contacto"),
    nombre_autorizado: get("nombre_autorizado"),
    curp_autorizado: get("curp_autorizado")
  };
}

function mostrarMensaje(id, mensaje) {
  const div = document.getElementById(id);
  if (!div) return;
  div.innerText = mensaje;
  div.style.display = "block";
}
