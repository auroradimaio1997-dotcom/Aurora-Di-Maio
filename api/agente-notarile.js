// Vercel serverless function — Node runtime.
//
// Env var required (Vercel → Project → Settings → Environment Variables):
//   CODEWORDS_NOTARILE_API_KEY - the Bearer key for this Codewords agent
//
// The key stays server-side only — never reference it from client code.

const AGENT_URL = "https://runtime.codewords.ai/run/agente_notarile_v2_b5b24c75";
const AGENT_TIMEOUT_MS = 9 * 60 * 1000;

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

  const apiKey = process.env.CODEWORDS_NOTARILE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "CODEWORDS_NOTARILE_API_KEY non configurata sul server." });
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

  const tema = (body && body.tema ? String(body.tema) : "").trim();
  if (!tema) {
    res.status(400).json({ error: "Indica un tema." });
    return;
  }
  if (tema.length > 300) {
    res.status(400).json({ error: "Tema troppo lungo (max 300 caratteri)." });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);

  try {
    const response = await fetch(AGENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ tema }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: `Errore dall'agente: ${errText.slice(0, 300)}` });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
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
