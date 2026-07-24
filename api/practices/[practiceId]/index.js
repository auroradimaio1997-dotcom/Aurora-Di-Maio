const { getSupabaseServerClient } = require("../../../lib/practices/supabaseServer");
const { notConfiguredResponse, setCors, STATUSES } = require("../../../lib/practices/shared");

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

  const { practiceId } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("practices")
      .select("*")
      .eq("practice_id", practiceId)
      .single();

    if (error) {
      res.status(404).json({ error: "Pratica non trovata." });
      return;
    }
    res.status(200).json({ practice: data });
    return;
  }

  if (req.method === "PATCH") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const patch = { updated_at: new Date().toISOString() };
    if (body?.title) patch.title = String(body.title).trim();
    if (body?.status) {
      if (!STATUSES.includes(body.status)) {
        res.status(400).json({ error: "Stato non valido." });
        return;
      }
      patch.status = body.status;
    }
    if (body?.parties !== undefined) patch.parties = body.parties;
    if (body?.description !== undefined) patch.description = body.description;

    const { data, error } = await supabase
      .from("practices")
      .update(patch)
      .eq("practice_id", practiceId)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ practice: data });
    return;
  }

  res.status(405).json({ error: "Metodo non consentito." });
};
