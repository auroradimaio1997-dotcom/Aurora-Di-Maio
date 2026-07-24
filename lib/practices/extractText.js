function resolveKind(buffer, mimeType, fileName) {
  const ext = (fileName || "").toLowerCase().split(".").pop();
  // PDFs always start with this magic header — trust it over a possibly
  // wrong/missing mimeType from the browser.
  if (buffer.subarray(0, 4).toString("latin1") === "%PDF") return "pdf";
  if (mimeType === "application/pdf" || ext === "pdf") return "pdf";
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  )
    return "docx";
  if (mimeType === "text/plain" || ext === "txt") return "txt";
  return null;
}

async function extractText(buffer, mimeType, fileName) {
  const kind = resolveKind(buffer, mimeType, fileName);
  try {
    if (kind === "pdf") {
      const pdfParse = require("pdf-parse");
      const result = await pdfParse(buffer);
      return result.text?.trim() || null;
    }
    if (kind === "docx") {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value?.trim() || null;
    }
    if (kind === "txt") {
      return buffer.toString("utf-8").trim() || null;
    }
  } catch {
    return null;
  }
  return null;
}

module.exports = { extractText };
