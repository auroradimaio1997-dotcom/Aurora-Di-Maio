const DOCUMENTS_BUCKET = "practice-documents";

const CATEGORIES = [
  "Visure ipocatastali",
  "Visure camerali",
  "Documenti delle parti",
  "Titoli di provenienza",
  "Urbanistica",
  "Catasto",
  "Fiscalità",
  "Bozze dell'atto",
  "Allegati",
  "Altro",
];

const STATUSES = [
  "Bozza",
  "In lavorazione",
  "In attesa di documenti",
  "Da verificare",
  "Completata",
  "Archiviata",
];

function notConfiguredResponse(res) {
  res.status(503).json({
    error: "Archiviazione permanente in preparazione.",
    detail:
      "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY non sono ancora configurate sul server.",
  });
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = { DOCUMENTS_BUCKET, CATEGORIES, STATUSES, notConfiguredResponse, setCors };
