import type { Practice, PracticeDocument, PracticeMessage } from "./types";

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

export function listPractices() {
  return request<{ practices: Practice[] }>("/api/practices");
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

export function getDocumentSignedUrl(practiceId: string, documentId: string) {
  return request<{ document: PracticeDocument; url: string; expiresInSeconds: number }>(
    `/api/practices/${practiceId}/documents/${documentId}`
  );
}

export function deleteDocument(practiceId: string, documentId: string) {
  return request<{ ok: true }>(`/api/practices/${practiceId}/documents/${documentId}`, {
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
