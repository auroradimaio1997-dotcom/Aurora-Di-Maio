const crypto = require("crypto");
const { getSupabaseServerClient } = require("../lib/practices/supabaseServer");
const { DOCUMENTS_BUCKET, notConfiguredResponse, setCors } = require("../lib/practices/shared");
const { extractText } = require("../lib/practices/extractText");

const MAX_BYTES = 4 * 1024 * 1024;

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
    let query = supabase
      .from("practice_templates")
      .select("*")
      .order("updated_at", { ascending: false });
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
    const notes = (body?.notes || "").trim();
    const fileName = (body?.fileName || "").trim();
    const mimeType = body?.mimeType || "application/octet-stream";
    const dataBase64 = body?.dataBase64 || "";

    if (!practiceType || !title || !fileName || !dataBase64) {
      res.status(400).json({ error: "Tipo, titolo e file sono obbligatori." });
      return;
    }

    const buffer = Buffer.from(dataBase64, "base64");
    if (buffer.byteLength > MAX_BYTES) {
      res.status(413).json({ error: "File troppo grande (max 4MB per ora)." });
      return;
    }

    const templateId = crypto.randomUUID();
    const storagePath = `schemi/${practiceType}/${templateId}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(storagePath, buffer, { contentType: mimeType, upsert: false });

    if (uploadError) {
      res.status(500).json({ error: `Errore nel caricamento: ${uploadError.message}` });
      return;
    }

    const content = await extractText(buffer, mimeType, fileName);

    const { data, error } = await supabase
      .from("practice_templates")
      .insert({
        template_id: templateId,
        practice_type: practiceType,
        title,
        notes: notes || null,
        content,
        storage_path: storagePath,
        mime_type: mimeType,
      })
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
