const crypto = require("crypto");
const { getSupabaseServerClient } = require("../../../lib/practices/supabaseServer");
const {
  DOCUMENTS_BUCKET,
  CATEGORIES,
  notConfiguredResponse,
  setCors,
} = require("../../../lib/practices/shared");

const MAX_BYTES = 4 * 1024 * 1024; // stays under Vercel's ~4.5MB body limit

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
      .from("documents")
      .select("*")
      .eq("practice_id", practiceId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ documents: data });
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

    const name = (body?.name || "").trim();
    const category = body?.category || "Altro";
    const mimeType = body?.mimeType || "application/octet-stream";
    const dataBase64 = body?.dataBase64 || "";

    if (!name || !dataBase64) {
      res.status(400).json({ error: "Nome file e contenuto sono obbligatori." });
      return;
    }
    if (!CATEGORIES.includes(category)) {
      res.status(400).json({ error: "Categoria non valida." });
      return;
    }

    const buffer = Buffer.from(dataBase64, "base64");
    if (buffer.byteLength > MAX_BYTES) {
      res.status(413).json({ error: "File troppo grande (max 4MB per ora)." });
      return;
    }

    const documentId = crypto.randomUUID();
    const storagePath = `${practiceId}/${documentId}-${name}`;

    const { error: uploadError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(storagePath, buffer, { contentType: mimeType, upsert: false });

    if (uploadError) {
      res.status(500).json({ error: `Errore nel caricamento: ${uploadError.message}` });
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .insert({
        document_id: documentId,
        practice_id: practiceId,
        name,
        category,
        storage_path: storagePath,
        mime_type: mimeType,
        size_bytes: buffer.byteLength,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(201).json({ document: data });
    return;
  }

  res.status(405).json({ error: "Metodo non consentito." });
};
