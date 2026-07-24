// Vercel serverless function — Node runtime.
//
// Powers only the "Fai una ricerca scientifica approfondita" tool — kept
// separate from api/agente-coordinatore.js (which drafts acts via n8n) so
// switching this one to Gemini doesn't touch act drafting at all.
//
// Env var required (Vercel → Project → Settings → Environment Variables):
//   GEMINI_API_KEY - a Google AI Studio API key
//
// The key stays server-side only — never reference it from client code.

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY non configurata sul server." });
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
  if (message.length > 30000) {
    res.status(400).json({ error: "Messaggio troppo lungo (max 30000 caratteri)." });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `Errore da Gemini: ${errText.slice(0, 300)}` });
      return;
    }

    const data = await response.json();
    const risposta = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
    res.status(200).json({ risposta: risposta || "Nessuna risposta ricevuta." });
  } catch (err) {
    if (err.name === "AbortError") {
      res.status(504).json({ error: "Gemini non ha risposto in tempo. Riprova." });
    } else {
      res.status(500).json({ error: "Errore interno nel contattare Gemini." });
    }
  } finally {
    clearTimeout(timeout);
  }
};
