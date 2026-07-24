import type { Practice, PracticeDocument, PracticeMessage, PracticeTemplate } from "./types";

export class PracticeStorageNotConfiguredError extends Error {
  constructor() {
    super("Archiviazione permanente in preparazione.");
    this.name = "PracticeStorageNotConfiguredError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (res.status === 503) {
    throw new PracticeStorageNotConfiguredError();
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Errore imprevisto.");
  }
  return data as T;
}

export function listPractices(options?: { trashed?: boolean }) {
  const query = options?.trashed ? "?trashed=1" : "";
  return request<{ practices: Practice[] }>(`/api/practices${query}`);
}

export function createPractice(input: {
  title: string;
  practiceType: string;
  area: string;
  agentId: string;
  parties?: string;
  description?: string;
}) {
  return request<{ practice: Practice }>("/api/practices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updatePractice(practiceId: string, patch: Partial<Practice>) {
  return request<{ practice: Practice }>(`/api/practices/${practiceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export function trashPractice(practiceId: string) {
  return request<{ practice: Practice }>(`/api/practices/${practiceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trash: true }),
  });
}

export function restorePractice(practiceId: string) {
  return request<{ practice: Practice }>(`/api/practices/${practiceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ restore: true }),
  });
}

export function deletePracticeForever(practiceId: string) {
  return request<{ ok: true }>(`/api/practices/${practiceId}`, {
    method: "DELETE",
  });
}

export function listDocuments(practiceId: string) {
  return request<{ documents: PracticeDocument[] }>(
    `/api/practices/${practiceId}/documents`
  );
}

export function uploadDocument(
  practiceId: string,
  input: { name: string; category: string; mimeType: string; dataBase64: string }
) {
  return request<{ document: PracticeDocument }>(
    `/api/practices/${practiceId}/documents`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );
}

export function getDocumentSignedUrl(_practiceId: string, documentId: string) {
  return request<{ document: PracticeDocument; url: string; expiresInSeconds: number }>(
    `/api/practice-documents/${documentId}`
  );
}

export function deleteDocument(_practiceId: string, documentId: string) {
  return request<{ ok: true }>(`/api/practice-documents/${documentId}`, {
    method: "DELETE",
  });
}

export function listMessages(practiceId: string) {
  return request<{ messages: PracticeMessage[] }>(
    `/api/practices/${practiceId}/messages`
  );
}

export function postMessage(
  practiceId: string,
  input: { role: "user" | "aurora"; text: string; documentId?: string }
) {
  return request<{ message: PracticeMessage }>(
    `/api/practices/${practiceId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );
}

export function listTemplates(practiceType: string) {
  return request<{ templates: PracticeTemplate[] }>(
    `/api/practice-templates?practiceType=${encodeURIComponent(practiceType)}`
  );
}

export function createTemplate(input: {
  practiceType: string;
  title: string;
  notes?: string;
  fileName: string;
  mimeType: string;
  dataBase64: string;
}) {
  return request<{ template: PracticeTemplate }>("/api/practice-templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteTemplate(templateId: string) {
  return request<{ ok: true }>(`/api/practice-templates/${templateId}`, {
    method: "DELETE",
  });
}

export function getTemplateSignedUrl(templateId: string) {
  return request<{ url: string }>(`/api/practice-templates/${templateId}?signedUrl=1`);
}

export function extractDocumentText(input: { mimeType: string; fileName: string; dataBase64: string }) {
  return request<{ text: string }>("/api/extract-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
