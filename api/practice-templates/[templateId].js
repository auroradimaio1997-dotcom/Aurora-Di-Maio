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

  const { templateId } = req.query;

  if (req.method === "DELETE") {
    const { error } = await supabase.from("practice_templates").delete().eq("template_id", templateId);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Metodo non consentito." });
};
