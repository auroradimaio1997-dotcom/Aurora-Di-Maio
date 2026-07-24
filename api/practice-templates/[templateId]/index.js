const { getSupabaseServerClient } = require("../../../lib/practices/supabaseServer");
const { DOCUMENTS_BUCKET, notConfiguredResponse, setCors } = require("../../../lib/practices/shared");

const SIGNED_URL_TTL_SECONDS = 300;

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

  if (req.method === "GET" && req.query.signedUrl) {
    const { data: tpl, error: tplError } = await supabase
      .from("practice_templates")
      .select("storage_path")
      .eq("template_id", templateId)
      .single();

    if (tplError || !tpl.storage_path) {
      res.status(404).json({ error: "Schema non trovato." });
      return;
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(tpl.storage_path, SIGNED_URL_TTL_SECONDS);

    if (signError) {
      res.status(500).json({ error: signError.message });
      return;
    }
    res.status(200).json({ url: signed.signedUrl });
    return;
  }

  if (req.method === "DELETE") {
    const { data: tpl } = await supabase
      .from("practice_templates")
      .select("storage_path")
      .eq("template_id", templateId)
      .single();

    if (tpl?.storage_path) {
      await supabase.storage.from(DOCUMENTS_BUCKET).remove([tpl.storage_path]);
    }

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
