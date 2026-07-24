const { getSupabaseServerClient } = require("../../lib/practices/supabaseServer");
const { notConfiguredResponse, setCors } = require("../../lib/practices/shared");

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    notConfiguredResponse(res);
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("practices")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ practices: data });
    return;
  }

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const title = (body?.title || "").trim();
    const practiceType = (body?.practiceType || "").trim();
    const area = (body?.area || "").trim();
    const agentId = (body?.agentId || "").trim();

    if (!title || !practiceType || !area || !agentId) {
      res.status(400).json({ error: "Nome, tipo, area e agente sono obbligatori." });
      return;
    }

    const { data, error } = await supabase
      .from("practices")
      .insert({
        title,
        practice_type: practiceType,
        area,
        agent_id: agentId,
        parties: body?.parties || null,
        description: body?.description || null,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(201).json({ practice: data });
    return;
  }

  res.status(405).json({ error: "Metodo non consentito." });
};
