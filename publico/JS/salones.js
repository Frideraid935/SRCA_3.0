const API = '/api/salones';

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       REGISTRAR SALÓN
    ========================= */
    const formRegistrar = document.getElementById("formulario-registrar-salon");
    if (formRegistrar) {
        formRegistrar.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                nombre: document.getElementById("nombre_salon").value,
                capacidad: document.getElementById("capacidad").value,
                numero_de_control: document.getElementById("numero_de_control").value
            };

            const mensaje = document.getElementById("mensaje-registrar");
            mensaje.textContent = "";

            try {
                const res = await fetch("/api/salones/registrar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                mensaje.textContent = result.message;
                mensaje.style.color = res.ok ? "green" : "red";
                if (res.ok) formRegistrar.reset();

            } catch {
                mensaje.textContent = "Error de conexión";
                mensaje.style.color = "red";
            }
        });
    }

    /* =========================
       BUSCAR SALÓN
    ========================= */
    const formBuscar = document.getElementById("formulario-buscar-salon");
    if (formBuscar) {
        formBuscar.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = document.getElementById("id_salon_buscar").value;
            const mensaje = document.getElementById("mensaje-buscar");
            const resultado = document.getElementById("resultado-salon");

            mensaje.textContent = "";
            resultado.style.display = "none";

            try {
                const res = await fetch(`/api/salones/buscar/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    mensaje.textContent = data.message;
                    mensaje.style.color = "red";
                    return;
                }

                document.getElementById("res-id").textContent = data.id;
                document.getElementById("res-nombre").textContent = data.nombre;
                document.getElementById("res-capacidad").textContent = data.capacidad;
                document.getElementById("res-profesor").textContent = data.numero_de_control;

                resultado.style.display = "block";
                mensaje.textContent = "Salón encontrado";
                mensaje.style.color = "green";

            } catch {
                mensaje.textContent = "Error al buscar salón";
                mensaje.style.color = "red";
            }
        });
    }

    /* =========================
       ELIMINAR SALÓN
    ========================= */
    const formEliminar = document.getElementById("formulario-eliminar-salon");
    if (formEliminar) {
        formEliminar.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = document.getElementById("id_salon_eliminar").value;
            const mensaje = document.getElementById("mensaje-eliminar");

            mensaje.textContent = "";

            try {
                const res = await fetch(`/api/salones/eliminar/${id}`, {
                    method: "DELETE"
                });

                const data = await res.json();
                mensaje.textContent = data.message;
                mensaje.style.color = res.ok ? "green" : "red";

            } catch {
                mensaje.textContent = "Error al eliminar salón";
                mensaje.style.color = "red";
            }
        });
    }
});
