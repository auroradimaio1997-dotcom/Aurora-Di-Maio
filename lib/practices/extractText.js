async function extractText(buffer, mimeType) {
  try {
    if (mimeType === "application/pdf") {
      const pdfParse = require("pdf-parse");
      const result = await pdfParse(buffer);
      return result.text?.trim() || null;
    }
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value?.trim() || null;
    }
  } catch {
    return null;
  }
  return null;
}

module.exports = { extractText };
