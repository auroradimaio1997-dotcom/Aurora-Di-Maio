const { getSupabaseServerClient } = require("../lib/practices/supabaseServer");
const { notConfiguredResponse, setCors } = require("../lib/practices/shared");

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
    const practiceType = req.query.practiceType;
    let query = supabase.from("practice_templates").select("*").order("updated_at", { ascending: false });
    if (practiceType) query = query.eq("practice_type", practiceType);

    const { data, error } = await query;
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ templates: data });
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

    const practiceType = (body?.practiceType || "").trim();
    const title = (body?.title || "").trim();
    const content = (body?.content || "").trim();

    if (!practiceType || !title || !content) {
      res.status(400).json({ error: "Tipo, titolo e contenuto sono obbligatori." });
      return;
    }

    const { data, error } = await supabase
      .from("practice_templates")
      .insert({ practice_type: practiceType, title, content })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(201).json({ template: data });
    return;
  }

  res.status(405).json({ error: "Metodo non consentito." });
};
