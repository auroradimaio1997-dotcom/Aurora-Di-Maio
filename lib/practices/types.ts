export type PracticeStatus =
  | "Bozza"
  | "In lavorazione"
  | "In attesa di documenti"
  | "Da verificare"
  | "Completata"
  | "Archiviata";

export const PRACTICE_STATUSES: PracticeStatus[] = [
  "Bozza",
  "In lavorazione",
  "In attesa di documenti",
  "Da verificare",
  "Completata",
  "Archiviata",
];

export type DocumentCategory =
  | "Visure ipocatastali"
  | "Visure camerali"
  | "Documenti delle parti"
  | "Titoli di provenienza"
  | "Urbanistica"
  | "Catasto"
  | "Fiscalità"
  | "Bozze dell'atto"
  | "Allegati"
  | "Altro";

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
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

export type Practice = {
  practice_id: string;
  title: string;
  practice_type: string;
  area: string;
  agent_id: string;
  status: PracticeStatus;
  parties: string | null;
  description: string | null;
  chat_id: string;
  created_at: string;
  updated_at: string;
};

export type PracticeDocument = {
  document_id: string;
  practice_id: string;
  name: string;
  category: DocumentCategory;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  status: string;
  uploaded_at: string;
};

export type PracticeMessage = {
  message_id: string;
  practice_id: string;
  role: "user" | "aurora";
  text: string;
  document_id: string | null;
  created_at: string;
};

export type PracticeTemplate = {
  template_id: string;
  practice_type: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};
