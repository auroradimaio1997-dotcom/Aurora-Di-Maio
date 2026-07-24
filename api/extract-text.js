const { extractText } = require("../lib/practices/extractText");

const MAX_BYTES = 4 * 1024 * 1024;

// Stateless text extraction (PDF/DOCX) for client-side flows that need
// the plain text of a file before sending it on, e.g. draft review in
// the practice chat. No storage, no practice association — just a
// converter.
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

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const mimeType = body?.mimeType || "";
  const dataBase64 = body?.dataBase64 || "";
  if (!dataBase64) {
    res.status(400).json({ error: "File mancante." });
    return;
  }

  const buffer = Buffer.from(dataBase64, "base64");
  if (buffer.byteLength > MAX_BYTES) {
    res.status(413).json({ error: "File troppo grande (max 4MB)." });
    return;
  }

  const text = await extractText(buffer, mimeType);
  if (!text) {
    res.status(422).json({
      error: "Non sono riuscita a estrarre il testo da questo file (formato non supportato o file non testuale).",
    });
    return;
  }

  res.status(200).json({ text });
};
