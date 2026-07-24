const { getSupabaseServerClient } = require("../../lib/practices/supabaseServer");
const { DOCUMENTS_BUCKET, TRASH_RETENTION_DAYS, notConfiguredResponse, setCors } = require("../../lib/practices/shared");

// Permanently purges anything that's been in the trash longer than the
// retention window — best-effort storage cleanup first, then the DB rows
// (documents/messages cascade via FK). Runs lazily on every list request
// since there's no cron; cheap because it's usually a no-op.
async function purgeExpiredTrash(supabase) {
  const cutoff = new Date(Date.now() - TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: expired } = await supabase
    .from("practices")
    .select("practice_id")
    .not("deleted_at", "is", null)
    .lt("deleted_at", cutoff);

  if (!expired || expired.length === 0) return;

  const practiceIds = expired.map((p) => p.practice_id);

  const { data: docs } = await supabase
    .from("documents")
    .select("storage_path")
    .in("practice_id", practiceIds);

  if (docs && docs.length > 0) {
    await supabase.storage.from(DOCUMENTS_BUCKET).remove(docs.map((d) => d.storage_path));
  }

  await supabase.from("practices").delete().in("practice_id", practiceIds);
}

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
    await purgeExpiredTrash(supabase);

    const trashed = req.query.trashed === "1";
    let query = supabase.from("practices").select("*");
    query = trashed
      ? query.not("deleted_at", "is", null).order("deleted_at", { ascending: false })
      : query.is("deleted_at", null).order("updated_at", { ascending: false });

    if (req.query.practiceType) {
      query = query.eq("practice_type", req.query.practiceType);
    }

    const { data, error } = await query;

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
