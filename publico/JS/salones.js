const API = '/api/salones';

document.addEventListener("DOMContentLoaded", () => {
    console.log("salones.js cargado");

    /* =========================
       REGISTRAR
    ========================= */
    const formRegistrar = document.getElementById("formulario-registrar-salon");
    if (formRegistrar) {
        console.log("Formulario registrar detectado");

        formRegistrar.addEventListener("submit", async (e) => {
            e.preventDefault();

            const mensaje = document.getElementById("mensaje-registrar");

            const data = {
                nombre: document.getElementById("nombre_salon").value,
                capacidad: document.getElementById("capacidad").value,
                numero_de_control: document.getElementById("numero_de_control").value
            };

            try {
                const res = await fetch("/api/salones/registrar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                mensaje.textContent = result.message;
                mensaje.className = res.ok ? "mensaje-exito" : "mensaje-error";

                if (res.ok) formRegistrar.reset();

            } catch (error) {
                mensaje.textContent = "Error al registrar salón";
                mensaje.className = "mensaje-error";
            }
        });
    }

    /* =========================
       BUSCAR
    ========================= */
    const formBuscar = document.getElementById("formulario-buscar-salon");
    if (formBuscar) {
        console.log("Formulario buscar detectado");

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
                    mensaje.className = "mensaje-error";
                    return;
                }

                document.getElementById("res-id").textContent = data.id;
                document.getElementById("res-nombre").textContent = data.nombre;
                document.getElementById("res-capacidad").textContent = data.capacidad;
                document.getElementById("res-profesor").textContent = data.numero_de_control;

                resultado.style.display = "block";
                mensaje.textContent = "Salón encontrado";
                mensaje.className = "mensaje-exito";

            } catch {
                mensaje.textContent = "Error al buscar salón";
                mensaje.className = "mensaje-error";
            }
        });
    }
});
