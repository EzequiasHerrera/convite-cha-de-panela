const invitation = document.getElementById("invitation-card");
const overlay = document.getElementById("overlay");
const polaroidImg = document.getElementById("polaroid-img");

const showNextPicture = () => {
  polaroidImg.src;
};

polaroidImg.addEventListener("click", () => {
  const formato = "jpg";

  const src = polaroidImg.src;
  const partes = src.split("nos");
  const numeroYFormato = partes[1]; // ej: "3.jpg"
  const [numero] = numeroYFormato.split(".");
  let nuevoNumero = parseInt(numero) + 1;
  if (nuevoNumero > 7) nuevoNumero = 1;
  polaroidImg.src = `${partes[0]}nos${nuevoNumero}.${formato}`;
});

const toggleFocusView = () => {
  invitation.classList.toggle("focus-view");
  invitation.classList.toggle("zoom-in");
  overlay.classList.toggle("d-none");
};

invitation.onclick = toggleFocusView;
overlay.onclick = toggleFocusView;

//--------------SUPABASE---------------------------------

const supabase = window.supabase.createClient(
  "https://orameskzbxlwtrguiwtu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYW1lc2t6Ynhsd3RyZ3Vpd3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjg2OTIsImV4cCI6MjA3Mjc0NDY5Mn0.Miwr-ai01F0oLbmA7fN_hIBiLDOuCTWIaPJLyRpTU5A"
);

//Recibo la caja de texto
const inputBox = document.getElementById("buscador");

//Busco el contenedor resultados
const divResultados = document.getElementById("resultados");

inputBox.addEventListener("input", async () => {
  //filtro contiene la palabra escrita en el input
  const filtro = inputBox.value.toLowerCase();

  //Espera mínimo 3 letras antes de buscar
  if (filtro.length < 3) {
    divResultados.innerHTML = "";
    return;
  }

  //Traigo todos los invitados de supabase
  const { data: invitados, error } = await supabase
    .from("invitados")
    .select("*");

  //Verifico si hay errores
  if (error) {
    divResultados.innerHTML = "Error al cargar invitados";
    return;
  }

  //Vacío la lista si ya tenía contenido
  divResultados.innerHTML = "";

  //Para cada invitado
  for (const invitado of invitados) {
    //Si el invitado no cumple con las condiciones del filtro no lo considero
    if (!invitado.nombre.toLowerCase().includes(filtro)) continue;

    //👶🏻 Traigo todos los hijos que coincidan con el ID del invitado
    const { data: hijos } = await supabase
      .from("hijos")
      .select("*")
      .eq("tutor_id", invitado.id);

    //Creo un <div> para poner el nombre y los botones
    const container = document.createElement("div");
    container.className =
      "invitado d-flex flex-row justify-content-between align-items-start bg-body-tertiary p-1 rounded shadow";

    //Creo un <p> para poner el nombre
    const nombre = document.createElement("p");
    nombre.className = "m-0";
    nombre.textContent = invitado.nombre;

    //Creo un <div> para poner los botones
    const divBotones = document.createElement("div");
    divBotones.className = "d-flex justify-content-center gap-3";

    //Inserto dentro del container la etiqueta <p> con el NOMBRE
    container.appendChild(nombre);

    //------BOTONES SIM Y NAO -------------------------------------
    //🟩
    const btnSim = document.createElement("button");
    btnSim.className = "btn btn-outline-success";
    btnSim.textContent = "Vou";

    //🟥
    const btnNao = document.createElement("button");
    btnNao.className = "btn btn-outline-danger";
    btnNao.textContent = "Não vou";

    //⬜
    const btnNaoSei = document.createElement("button");
    btnNaoSei.className = "btn btn-outline-secondary";
    btnNaoSei.textContent = "Ainda não sei";

    //Seteo el funcionamiento de los botones si y no
    btnSim.addEventListener("click", async () => {
      updateInvitadoState("confirmado", "invitados", invitado.id);
      toggleButtonState("confirmado");
    });

    btnNao.addEventListener("click", async () => {
      updateInvitadoState("denegado", "invitados", invitado.id);
      toggleButtonState("denegado");
    });

    btnNaoSei.addEventListener("click", async () => {
      updateInvitadoState("pendente", "invitados", invitado.id);
      toggleButtonState("pendente");
    });

    const toggleButtonState = (estado) => {
      if (estado === "confirmado") {
        btnSim.classList.add("active");
        btnNao.classList.remove("active");
        btnNaoSei.classList.remove("active");
      } else if (estado == "denegado") {
        btnSim.classList.remove("active");
        btnNao.classList.add("active");
        btnNaoSei.classList.remove("active");
      } else {
        btnSim.classList.remove("active");
        btnNao.classList.remove("active");
        btnNaoSei.classList.add("active");
      }
      showConfirmation();
    };

    const updateInvitadoState = async (state, table, id) => {
      toggleButtonState(state);

      console.log(
        `Actualizando estado de ${id} en la tabla ${table} con el estado ${state}`
      );

      const { error } = await supabase
        .from(table)
        .update({ estado: state })
        .eq("id", id);

      if (error) {
        console.error("Error al confirmar invitado:", error);
        return;
      }

      
    };

    //Coloco los botones dentro del contenedor de botones
    divBotones.appendChild(btnSim);
    divBotones.appendChild(btnNao);
    divBotones.appendChild(btnNaoSei);

    //Agrego el contenedor con botones al contenedor padre
    container.appendChild(divBotones);

    toggleButtonState(invitado.estado);

    divResultados.innerHTML = "";

    divResultados.appendChild(container);

    const titleResponsable = document.createElement("p");
    titleResponsable.textContent = "Confirma em nome de:";
    titleResponsable.className = "text-center mb-0 mt-2";
    divResultados.appendChild(titleResponsable);

    //👶🏻 Si tiene hijos
    if (hijos.length > 0) {
      const containerHijos = document.createElement("div");
      containerHijos.className = "hijos d-flex flex-row flex-wrap justify-content-center";

      hijos.forEach((hijo) => {
        const li = document.createElement("div");
        li.className = "bg-body-tertiary p-1 rounded shadow";

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

        const btnHijoNaoSei = document.createElement("button");
        btnHijoNaoSei.className = "btn btn-outline-secondary btn-sm";
        btnHijoNaoSei.textContent = "Ainda não sei";

        const actualizarBotonesHijo = (estado) => {
          if (estado === "confirmado") {
            btnHijoSim.classList.add("active");
            btnHijoNao.classList.remove("active");
            btnHijoNaoSei.classList.remove("active");
          } else if (estado == "denegado") {
            btnHijoSim.classList.remove("active");
            btnHijoNao.classList.add("active");
            btnHijoNaoSei.classList.remove("active");
          } else {
            btnHijoSim.classList.remove("active");
            btnHijoNao.classList.remove("active");
            btnHijoNaoSei.classList.add("active");
          }
          showConfirmation();
        };

        const updateHijoState = async (state, table, id) => {
          actualizarBotonesHijo(state);

          const { error } = await supabase
            .from(table)
            .update({ estado: state })
            .eq("id", id);

          if (error) {
            console.error("Error al confirmar invitado:", error);
            return;
          }
        };

        actualizarBotonesHijo(hijo.estado);

        btnHijoSim.addEventListener("click", async () => {
          updateHijoState("confirmado", "hijos", hijo.id)
        });

        btnHijoNao.addEventListener("click", async () => {
          updateHijoState("denegado", "hijos", hijo.id)
        });

        btnHijoNaoSei.addEventListener("click", async () => {
          updateHijoState("pendente", "hijos", hijo.id)
        });



        botonesHijo.appendChild(btnHijoSim);
        botonesHijo.appendChild(btnHijoNao);
        botonesHijo.appendChild(btnHijoNaoSei);
        li.appendChild(botonesHijo);
        containerHijos.appendChild(li);
      });

      divResultados.appendChild(containerHijos);
    }
  }
});


const showConfirmation = () => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="position-fixed bg-success p-3 top-0 w-100 text-white rounded" style="z-index: 1000;">
      ✅ Alteração salva
    </div>
  `;

  const confirmation = wrapper.firstChild;
  document.body.appendChild(confirmation);

  setTimeout(() => {
    confirmation.remove(); // 👈 Lo elimina del DOM
  }, 2000); // 2 segundos de visibilidad
};