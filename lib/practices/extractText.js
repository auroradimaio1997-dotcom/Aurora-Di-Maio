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
  if (kind === "pdf") {
    // pdf-parse v2 rewrote its API to a class (PDFParse), replacing the
    // old plain function. Its pdfjs-dist internals reference DOMMatrix
    // (a browser global) even for plain text extraction — in Vercel's
    // Node runtime that's missing, so pull it from @napi-rs/canvas
    // (already a pdf-parse dependency) before parsing.
    if (typeof globalThis.DOMMatrix === "undefined") {
      globalThis.DOMMatrix = require("@napi-rs/canvas").DOMMatrix;
    }
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    const text = result.text?.replace(/\n*-- \d+ of \d+ --\n*/g, "\n").trim();
    return text || null;
  }
  if (kind === "docx") {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() || null;
  }
  if (kind === "txt") {
    return buffer.toString("utf-8").trim() || null;
  }
  return null;
}

module.exports = { extractText };
