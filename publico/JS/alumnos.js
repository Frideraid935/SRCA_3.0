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
     LISTAR ALUMNOS
  ================================ */
  async function listarAlumnos(tablaId) {
    const tabla = document.getElementById(tablaId);
    if (!tabla) return;

    const res = await fetch("/api/alumnos/listar");
    const alumnos = await res.json();

    tabla.innerHTML = "";
    alumnos.forEach(a => {
      tabla.innerHTML += `
        <tr>
          <td>${a.numero_de_control}</td>
          <td>${a.nombre}</td>
          <td>${a.fecha_nacimiento}</td>
        </tr>
      `;
    });
  }

  /* ===============================
     BUSCAR ALUMNO
  ================================ */
  const formBuscar = document.getElementById("formulario-buscar");
  if (formBuscar) {
    listarAlumnos("tabla-buscar"); // mostrar todos al inicio

    formBuscar.addEventListener("submit", async (e) => {
      e.preventDefault();
      const numero = document.getElementById("numero_de_control").value;

      const res = await fetch("/api/alumnos/listar");
      const alumnos = await res.json();

      const tabla = document.getElementById("tabla-buscar");
      tabla.innerHTML = "";

      alumnos
        .filter(a => a.numero_de_control.includes(numero))
        .forEach(a => {
          tabla.innerHTML += `
            <tr>
              <td>${a.numero_de_control}</td>
              <td>${a.nombre}</td>
              <td>${a.fecha_nacimiento}</td>
            </tr>
          `;
        });
    });
  }

  /* ===============================
     ACTUALIZAR ALUMNO
  ================================ */
  const formActualizar = document.getElementById("formulario-actualizar");
  if (formActualizar) {
    listarAlumnos("tabla-actualizar"); // mostrar todos al inicio

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

      listarAlumnos("tabla-actualizar"); // refrescar tabla
      formActualizar.reset();
    });
  }

  /* ===============================
     ELIMINAR ALUMNO
  ================================ */
  const formEliminar = document.getElementById("formulario-eliminar");
  if (formEliminar) {
    listarAlumnos("tabla-eliminar"); // mostrar todos al inicio

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

      listarAlumnos("tabla-eliminar"); // refrescar tabla
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
