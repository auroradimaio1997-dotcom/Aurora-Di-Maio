const { getSupabaseServerClient } = require("../../../lib/practices/supabaseServer");
const { DOCUMENTS_BUCKET, notConfiguredResponse, setCors } = require("../../../lib/practices/shared");

const SIGNED_URL_TTL_SECONDS = 300; // 5 minutes — never a permanent public URL

// Flat (single dynamic segment) on purpose — Vercel's zero-config Node
// functions don't reliably route a SECOND nested [param] folder
// (api/practices/[practiceId]/documents/[documentId].js 404s in
// production even though it builds fine). document_id is a globally
// unique UUID, so looking it up alone is enough; no need to also carry
// practiceId in the path.
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

  const { documentId } = req.query;

  if (req.method === "GET") {
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("document_id", documentId)
      .single();

    if (docError) {
      res.status(404).json({ error: "Documento non trovato." });
      return;
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(doc.storage_path, SIGNED_URL_TTL_SECONDS);

    if (signError) {
      res.status(500).json({ error: signError.message });
      return;
    }

    res.status(200).json({ document: doc, url: signed.signedUrl, expiresInSeconds: SIGNED_URL_TTL_SECONDS });
    return;
  }

  if (req.method === "DELETE") {
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("document_id", documentId)
      .single();

    if (docError) {
      res.status(404).json({ error: "Documento non trovato." });
      return;
    }

    await supabase.storage.from(DOCUMENTS_BUCKET).remove([doc.storage_path]);

    const { error } = await supabase.from("documents").delete().eq("document_id", documentId);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Metodo non consentito." });
};
