import { createClient } from "@supabase/supabase-js";
async function resetLista() {

  const supabase = createClient(
    "https://orameskzbxlwtrguiwtu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYW1lc2t6Ynhsd3RyZ3Vpd3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjg2OTIsImV4cCI6MjA3Mjc0NDY5Mn0.Miwr-ai01F0oLbmA7fN_hIBiLDOuCTWIaPJLyRpTU5A"
  );

  const { data: hijos, error } = await supabase
    .from("hijos")
    .select("*");

  if (error) {
    console.error("Erro ao buscar convidados:", error);
    return;
  }

  for (const hijo of hijos) {
    const { error: updateError } = await supabase
      .from("hijos")
      .update({ estado: "pendente" })
      .eq("id", hijo.id);

    if (updateError) {
      console.error(`Erro ao atualizar convidado ${hijo.id}:`, updateError);
    }
  }
}

resetLista();
