// Placeholder for the future OneLegale (Wolters Kluwer) API integration.
// Not wired to any real endpoint yet — there's no subscription/API key.
// Once ONELEGALE_API_KEY is set on Vercel and the actual OneLegale API
// contract is known, replace the body below with a real fetch() call,
// same pattern as api/agente-coordinatore.js. Never put the key in
// client code.

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

  if (!process.env.ONELEGALE_API_KEY) {
    res.status(503).json({
      error: "Ricerca automatica OneLegale in preparazione — abbonamento e chiave API non ancora configurati.",
    });
    return;
  }

  res.status(501).json({ error: "Integrazione OneLegale non ancora implementata." });
};
