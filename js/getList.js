async function carregarLista() {
  const supabase = window.supabase.createClient(
    "https://orameskzbxlwtrguiwtu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYW1lc2t6Ynhsd3RyZ3Vpd3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjg2OTIsImV4cCI6MjA3Mjc0NDY5Mn0.Miwr-ai01F0oLbmA7fN_hIBiLDOuCTWIaPJLyRpTU5A"
  );

  const list = document.getElementById("orderlist");
  const listDependent = document.getElementById("orderlistdependent");

  const { data: invitados, error } = await supabase
    .from("invitados")
    .select("*");

  if (error) {
    list.innerHTML = "Erro ao carregar convidados";
    return;
  }

  let confirmados = 0;
  let denegados = 0;
  let pendentes = 0;

  for (const invitado of invitados) {
    const containerInvitado = document.createElement("div");
    containerInvitado.className =
      "invitado d-flex flex-row justify-content-between align-items-start p-1 rounded";

    const nombre = document.createElement("p");
    nombre.textContent = invitado.nombre;
    containerInvitado.appendChild(nombre);

    const status = document.createElement("p");

    switch (invitado.estado) {
      case "pendente":
        status.textContent = "Pendente";
        status.className = "bg-secondary p-2 rounded text-white";
        containerInvitado.appendChild(status);
        pendentes++;
        break;

      case "denegado":
        status.textContent = "Não vai";
        status.className = "bg-danger p-2 rounded text-white";
        containerInvitado.appendChild(status);
        denegados++;
        break;

      case "confirmado":
        status.textContent = "Vai";
        status.className = "bg-success p-2 rounded text-white";
        containerInvitado.appendChild(status);
        confirmados++;
        break;
      default:
        break;
    }

    list.appendChild(containerInvitado);
  }

  const { data: hijos, errordependent } = await supabase
    .from("hijos")
    .select("*");

  if (errordependent) {
    listDependent.innerHTML = "Erro ao carregar convidados";
    return;
  }

  for (const hijo of hijos) {
    const containerInvitadoDependent = document.createElement("div");
    containerInvitadoDependent.className =
      "invitado d-flex flex-row justify-content-between align-items-start p-1 rounded";

    const nombre = document.createElement("p");
    nombre.textContent = hijo.nombre;
    containerInvitadoDependent.appendChild(nombre);

    const status = document.createElement("p");

    switch (hijo.estado) {
      case "pendente":
        status.textContent = "Pendente";
        status.className = "bg-secondary p-2 rounded text-white";
        containerInvitadoDependent.appendChild(status);
        pendentes++;
        break;

      case "denegado":
        status.textContent = "Não vai";
        status.className = "bg-danger p-2 rounded text-white";
        containerInvitadoDependent.appendChild(status);
        denegados++;
        break;

      case "confirmado":
        status.textContent = "Vai";
        status.className = "bg-success p-2 rounded text-white";
        containerInvitadoDependent.appendChild(status);
        confirmados++;
        break;
      default:
        break;
    }

    listDependent.appendChild(containerInvitadoDependent);
  }

  const total = document.getElementById("total");
  total.textContent = `Vão: ${confirmados} Não vão: ${denegados} Ainda não sabem: ${pendentes}`;
}

carregarLista();
