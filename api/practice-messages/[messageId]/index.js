const { getSupabaseServerClient } = require("../../../lib/practices/supabaseServer");
const { notConfiguredResponse, setCors } = require("../../../lib/practices/shared");

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

  const { messageId } = req.query;

  if (req.method === "PATCH") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const text = (body?.text || "").trim();
    if (!text) {
      res.status(400).json({ error: "Testo obbligatorio." });
      return;
    }

    const { data, error } = await supabase
      .from("practice_messages")
      .update({ text })
      .eq("message_id", messageId)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: data });
    return;
  }

  res.status(405).json({ error: "Metodo non consentito." });
};
