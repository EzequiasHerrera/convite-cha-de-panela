const invitation = document.getElementById("invitation-card");
const overlay = document.getElementById("overlay");
const polaroidImg = document.getElementById("polaroid-img");

const showNextPicture = () => {
  polaroidImg.src;
};

polaroidImg.addEventListener("click", () => {
  const src = polaroidImg.src;

  // Buscar el número en el nombre del archivo (ej: nos3.jpg)
  const match = src.match(/nos(\d+)/);

  if (match) {
    const numero = parseInt(match[1]); // Extrae el número como entero
    const nuevoNumero = numero + 1;

    // Reemplazar el número en el src
    const nuevoSrc = src.replace(/nos\d+/, `nos${nuevoNumero}`);
    polaroidImg.src = nuevoSrc;

    console.log("Nueva imagen:", nuevoSrc);
  } else {
    console.log("No se encontró número en el src");
  }
});

const toggleFocusView = () => {
  invitation.classList.toggle("focus-view");
  invitation.classList.toggle("zoom-in");
  overlay.classList.toggle("d-none");
};

invitation.onclick = toggleFocusView;
overlay.onclick = toggleFocusView;

const supabase = window.supabase.createClient(
  "https://orameskzbxlwtrguiwtu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYW1lc2t6Ynhsd3RyZ3Vpd3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjg2OTIsImV4cCI6MjA3Mjc0NDY5Mn0.Miwr-ai01F0oLbmA7fN_hIBiLDOuCTWIaPJLyRpTU5A"
);

const buscador = document.getElementById("buscador");
const resultados = document.getElementById("resultados");

buscador.addEventListener("input", async () => {
  const filtro = buscador.value.toLowerCase();

  const { data: invitados, error } = await supabase
    .from("invitados")
    .select("*");

  if (error) {
    resultados.innerHTML = "Error al cargar invitados";
    return;
  }

  resultados.innerHTML = "";

  for (const invitado of invitados) {
    if (filtro.length < 3) return; // Espera mínimo 2 letras antes de buscar
    if (!invitado.nombre.toLowerCase().includes(filtro)) continue;

    const { data: hijos } = await supabase
      .from("hijos")
      .select("*")
      .eq("tutor_id", invitado.id);

    const div = document.createElement("div");
    div.className =
      "invitado d-flex flex-column align-items-start bg-body-tertiary p-3 rounded m-2";

    const nombre = document.createElement("p");
    nombre.className = "m-0";
    nombre.textContent = invitado.nombre;
    div.appendChild(nombre);

    const botones = document.createElement("div");
    botones.className = "d-flex justify-content-center gap-3";

    const btnSim = document.createElement("button");
    btnSim.className = "btn btn-outline-success";
    btnSim.textContent = "Sim";

    const btnNao = document.createElement("button");
    btnNao.className = "btn btn-outline-danger";
    btnNao.textContent = "Não";

    const actualizarBotones = (estado) => {
      if (estado === "confirmado") {
        btnSim.classList.add("active");
        btnNao.classList.remove("active");
      } else {
        btnSim.classList.remove("active");
        btnNao.classList.add("active");
      }
    };

    actualizarBotones(invitado.estado);

    btnSim.addEventListener("click", async () => {
      await supabase
        .from("invitados")
        .update({ estado: "confirmado" })
        .eq("id", invitado.id);
      actualizarBotones("confirmado");
    });

    btnNao.addEventListener("click", async () => {
      await supabase
        .from("invitados")
        .update({ estado: "pendiente" })
        .eq("id", invitado.id);
      actualizarBotones("pendiente");
    });

    botones.appendChild(btnSim);
    botones.appendChild(btnNao);
    div.appendChild(botones);

    if (hijos.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "hijos pt-2";

      hijos.forEach((hijo) => {
        const li = document.createElement("li");

        const hijoNombre = document.createElement("h6");
        hijoNombre.textContent = hijo.nombre;
        li.appendChild(hijoNombre);

        const botonesHijo = document.createElement("div");
        botonesHijo.className = "d-flex justify-content-center gap-3";

        const btnHijoSim = document.createElement("button");
        btnHijoSim.className = "btn btn-outline-success btn-sm";
        btnHijoSim.textContent = "Sim";

        const btnHijoNao = document.createElement("button");
        btnHijoNao.className = "btn btn-outline-danger btn-sm";
        btnHijoNao.textContent = "Não";

        const actualizarBotonesHijo = (estado) => {
          if (estado === "confirmado") {
            btnHijoSim.classList.add("active");
            btnHijoNao.classList.remove("active");
          } else {
            btnHijoSim.classList.remove("active");
            btnHijoNao.classList.add("active");
          }
        };

        actualizarBotonesHijo(hijo.estado);

        btnHijoSim.addEventListener("click", async () => {
          await supabase
            .from("hijos")
            .update({ estado: "confirmado" })
            .eq("id", hijo.id);
          actualizarBotonesHijo("confirmado");
        });

        btnHijoNao.addEventListener("click", async () => {
          await supabase
            .from("hijos")
            .update({ estado: "pendiente" })
            .eq("id", hijo.id);
          actualizarBotonesHijo("pendiente");
        });

        botonesHijo.appendChild(btnHijoSim);
        botonesHijo.appendChild(btnHijoNao);
        li.appendChild(botonesHijo);
        ul.appendChild(li);
      });

      div.appendChild(ul);
    }

    resultados.appendChild(div);
  }
});
