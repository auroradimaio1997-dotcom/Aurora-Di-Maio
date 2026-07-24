// Vercel serverless function — Node runtime.
//
// Env var required (Vercel → Project → Settings → Environment Variables):
//   N8N_COORDINATORE_SECRET - the shared secret checked by the n8n
//     workflow's "Verifica chiave" node
//
// Replaces the earlier Codewords-based coordinatore: this now calls the
// user's own n8n workflow (webhook → auth check → AI Agent → respond).
// The secret stays server-side only — never reference it from client code.

const AGENT_URL = "https://auroradimaio.app.n8n.cloud/webhook/aurora-coordinatore";
const AGENT_TIMEOUT_MS = 60 * 1000;

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

  const secret = process.env.N8N_COORDINATORE_SECRET;
  if (!secret) {
    res.status(500).json({ error: "N8N_COORDINATORE_SECRET non configurata sul server." });
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

  const message = (body && body.message ? String(body.message) : "").trim();
  if (!message) {
    res.status(400).json({ error: "Scrivi un messaggio." });
    return;
  }
  // Raised from the original 2000 to accommodate full document review
  // (a real atto notarile easily runs several thousand characters) while
  // still guarding against runaway payloads.
  if (message.length > 30000) {
    res.status(400).json({ error: "Messaggio troppo lungo (max 30000 caratteri)." });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);

  try {
    const response = await fetch(AGENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret,
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `Errore dall'agente: ${errText.slice(0, 300)}` });
      return;
    }

    const data = await response.json();
    res.status(200).json({ risposta: data.risposta });
  } catch (err) {
    if (err.name === "AbortError") {
      res.status(504).json({ error: "L'agente non ha risposto in tempo. Riprova più tardi." });
    } else {
      res.status(500).json({ error: "Errore interno nel contattare l'agente." });
    }
  } finally {
    clearTimeout(timeout);
  }
};
