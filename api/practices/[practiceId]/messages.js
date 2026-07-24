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

  const { practiceId } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("practice_messages")
      .select("*")
      .eq("practice_id", practiceId)
      .order("created_at", { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ messages: data });
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

    const role = body?.role;
    const text = (body?.text || "").trim();
    if (role !== "user" && role !== "aurora") {
      res.status(400).json({ error: "Ruolo non valido." });
      return;
    }
    if (!text) {
      res.status(400).json({ error: "Testo obbligatorio." });
      return;
    }

    const { data, error } = await supabase
      .from("practice_messages")
      .insert({
        practice_id: practiceId,
        role,
        text,
        document_id: body?.documentId || null,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    await supabase
      .from("practices")
      .update({ updated_at: new Date().toISOString() })
      .eq("practice_id", practiceId);

    res.status(201).json({ message: data });
    return;
  }

  res.status(405).json({ error: "Metodo non consentito." });
};
