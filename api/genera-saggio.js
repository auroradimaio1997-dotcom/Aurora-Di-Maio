// Vercel serverless function — Node runtime.
//
// Env var required (Vercel → Project → Settings → Environment Variables):
//   ANTHROPIC_API_KEY - your Claude API key
//
// This endpoint drafts an essay using ONLY the documents the user uploads
// or pastes in the browser — it never queries OneLegale or any other
// external database, and never falls back to the model's general
// knowledge. That keeps it clear of any subscription database's terms of
// service: the only "research" happening here is on content the user
// already retrieved herself, by hand, through her own legitimate access.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-5";
const MAX_DOC_CHARS = 60000;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo non consentito." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY non configurata sul server." });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const topic = (body && body.topic ? String(body.topic) : "").trim();
  const documents = Array.isArray(body && body.documents) ? body.documents : [];

  if (!topic) {
    res.status(400).json({ error: "Indica un argomento di ricerca." });
    return;
  }
  if (topic.length > 300) {
    res.status(400).json({ error: "Argomento troppo lungo (max 300 caratteri)." });
    return;
  }

  const cleanDocs = documents
    .map((d) => ({
      name: String((d && d.name) || "documento").slice(0, 200),
      text: String((d && d.text) || "").slice(0, MAX_DOC_CHARS),
    }))
    .filter((d) => d.text.trim().length > 0)
    .slice(0, 10);

  if (cleanDocs.length === 0) {
    res.status(400).json({
      error: "Carica o incolla almeno un documento: l'assistente scrive solo a partire dai tuoi materiali, non usa fonti esterne.",
    });
    return;
  }

  const sourcesBlock = cleanDocs
    .map((d, i) => `[${i + 1}] ${d.name}\n${d.text}`)
    .join("\n\n---\n\n");

  const systemPrompt = `Sei un assistente di scrittura accademica per una dottoranda in Giurisprudenza.
Scrivi un saggio (600-900 parole, in italiano) sul tema indicato, usando ESCLUSIVAMENTE i documenti forniti di seguito.

Regole vincolanti:
- Non usare conoscenza generale e non aggiungere informazioni che non provengano dai documenti forniti.
- Ogni affermazione sostanziale deve essere riconducibile a un documento; cita la fonte tra parentesi quadre col suo numero, es. [2].
- Se i documenti forniti non coprono un aspetto rilevante del tema, dillo esplicitamente invece di colmare il vuoto con conoscenza generale o invenzioni.
- Struttura: introduzione, 2-3 sezioni tematiche, conclusione, poi una sezione finale "Fonti" con l'elenco numerato dei documenti usati.
- Tono accademico, sobrio.

Documenti forniti dall'utente:
${sourcesBlock}`;

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: `Tema di ricerca: ${topic}` }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `Errore dal servizio AI: ${errText.slice(0, 300)}` });
      return;
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n\n");

    res.status(200).json({ essay: text || "Nessun contenuto generato." });
  } catch (err) {
    res.status(500).json({ error: "Errore interno nella generazione del saggio." });
  }
};
