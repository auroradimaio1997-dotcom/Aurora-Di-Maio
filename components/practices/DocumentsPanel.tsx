"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Download, FileText, Trash2, Upload, X } from "lucide-react";
import {
  deleteDocument,
  deleteTemplate,
  getDocumentSignedUrl,
  getTemplateSignedUrl,
  listDocuments,
  listTemplates,
  readFileAsBase64,
  uploadDocument,
} from "@/lib/practices/api";
import { DOCUMENT_CATEGORIES, type DocumentCategory, type PracticeDocument, type PracticeTemplate } from "@/lib/practices/types";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AcquireDocumentForm({
  practiceId,
  initialCategory,
  onUploaded,
  onClose,
}: {
  practiceId: string;
  initialCategory?: DocumentCategory;
  onUploaded: (doc: PracticeDocument) => void;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>(initialCategory ?? "Altro");
  const [status, setStatus] = useState<"idle" | "uploading" | "error" | "not-configured">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleConfirm() {
    if (!file) return;
    setStatus("uploading");
    try {
      const dataBase64 = await readFileAsBase64(file);
      const { document } = await uploadDocument(practiceId, {
        name: file.name,
        category,
        mimeType: file.type || "application/octet-stream",
        dataBase64,
      });
      onUploaded(document);
    } catch (err) {
      if (err instanceof Error && err.name === "PracticeStorageNotConfiguredError") {
        setStatus("not-configured");
      } else {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Errore imprevisto.");
      }
    }
  }

  return (
    <div className="mb-3 rounded-lg border bg-muted/60 p-2.5 text-xs">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-foreground">Acquisisci documento</span>
        <button type="button" onClick={onClose} className="text-secondary hover:text-foreground">
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.docx,image/jpeg,image/png"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-2 w-full text-xs text-foreground"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as DocumentCategory)}
        className="mb-2 w-full rounded-md border bg-background px-2 py-1.5 text-xs text-foreground"
      >
        {DOCUMENT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {status === "not-configured" && (
        <p className="mb-2 text-secondary">Archiviazione permanente in preparazione.</p>
      )}
      {status === "error" && <p className="mb-2 text-destructive">{errorMsg}</p>}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!file || status === "uploading"}
        className="w-full rounded-full bg-blue-600 py-1.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "uploading" ? "Caricamento…" : "Carica nella pratica"}
      </button>
    </div>
  );
}

type ListedItem = {
  key: string;
  name: string;
  meta: string;
  onOpen: () => void;
  onDelete: () => void;
};

function DocumentGroup({ label, items, defaultOpen }: { label: string; items: ListedItem[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1 rounded-md px-1 py-1.5 text-left text-xs font-semibold text-secondary hover:text-foreground"
      >
        <ChevronDown
          size={12}
          className={`shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
          aria-hidden="true"
        />
        {label} ({items.length})
      </button>
      {open &&
        (items.length === 0 ? (
          <p className="ml-4 mb-2 text-xs text-secondary">Nessun documento.</p>
        ) : (
          items.map((item) => (
            <div key={item.key} className="ml-4 mb-2 rounded-lg border p-2 text-xs">
              <p className="truncate font-medium text-foreground">{item.name}</p>
              <p className="mt-0.5 text-secondary">{item.meta}</p>
              <div className="mt-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={item.onOpen}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-secondary hover:bg-muted hover:text-foreground"
                >
                  <Download size={12} aria-hidden="true" />
                  Apri
                </button>
                <button
                  type="button"
                  onClick={item.onDelete}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-secondary hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={12} aria-hidden="true" />
                  Elimina
                </button>
              </div>
            </div>
          ))
        ))}
    </div>
  );
}

const OTHER_CATEGORIES: DocumentCategory[] = [
  "Titoli di provenienza",
  "Urbanistica",
  "Catasto",
  "Fiscalità",
  "Bozze dell'atto",
  "Allegati",
  "Altro",
];

export default function DocumentsPanel({
  practiceId,
  practiceType,
  collapsed,
  onToggleCollapsed,
  pendingVisuraCategory,
  onClearPendingVisura,
}: {
  practiceId: string;
  practiceType: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  pendingVisuraCategory?: DocumentCategory | null;
  onClearPendingVisura?: () => void;
}) {
  const [documents, setDocuments] = useState<PracticeDocument[]>([]);
  const [templates, setTemplates] = useState<PracticeTemplate[]>([]);
  const [notConfigured, setNotConfigured] = useState(false);
  const [showAcquire, setShowAcquire] = useState(false);
  const [acquireCategory, setAcquireCategory] = useState<DocumentCategory | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listDocuments(practiceId), listTemplates(practiceType)])
      .then(([docsRes, tplRes]) => {
        if (!cancelled) {
          setDocuments(docsRes.documents);
          setTemplates(tplRes.templates);
        }
      })
      .catch((err) => {
        if (!cancelled && err?.name === "PracticeStorageNotConfiguredError") {
          setNotConfigured(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [practiceId, practiceType]);

  async function handleOpenDocument(doc: PracticeDocument) {
    const { url } = await getDocumentSignedUrl(practiceId, doc.document_id);
    window.open(url, "_blank", "noopener");
  }

  async function handleDeleteDocument(doc: PracticeDocument) {
    if (!window.confirm(`Eliminare "${doc.name}"? L'operazione non è reversibile.`)) return;
    await deleteDocument(practiceId, doc.document_id);
    setDocuments((prev) => prev.filter((d) => d.document_id !== doc.document_id));
  }

  async function handleOpenTemplate(tpl: PracticeTemplate) {
    const { url } = await getTemplateSignedUrl(tpl.template_id);
    window.open(url, "_blank", "noopener");
  }

  async function handleDeleteTemplate(tpl: PracticeTemplate) {
    if (!window.confirm(`Eliminare lo schema "${tpl.title}"?`)) return;
    await deleteTemplate(tpl.template_id);
    setTemplates((prev) => prev.filter((t) => t.template_id !== tpl.template_id));
  }

  function docToItem(doc: PracticeDocument): ListedItem {
    return {
      key: doc.document_id,
      name: doc.name,
      meta: `${formatSize(doc.size_bytes)} · ${new Date(doc.uploaded_at).toLocaleDateString("it-IT")}`,
      onOpen: () => handleOpenDocument(doc),
      onDelete: () => handleDeleteDocument(doc),
    };
  }

  const visure = documents.filter(
    (d) => d.category === "Visure ipocatastali" || d.category === "Visure camerali"
  );
  const dottrina = documents.filter((d) => d.category === "Dottrina e Giurisprudenza");
  const partiIdentita = documents.filter((d) => d.category === "Documenti delle parti");
  const altri = documents.filter((d) => OTHER_CATEGORIES.includes(d.category));

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="flex h-full w-10 shrink-0 items-center justify-center border-l text-secondary hover:bg-muted hover:text-foreground"
        aria-label="Apri documenti della pratica"
      >
        <FileText size={16} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="flex h-full w-full flex-col border-l bg-background p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Documenti della pratica</h3>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="rounded-full p-1 text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Richiudi pannello documenti"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      {notConfigured && (
        <p className="mb-3 rounded-lg bg-muted px-3 py-2 text-xs text-secondary">
          Archiviazione permanente in preparazione.
        </p>
      )}

      {pendingVisuraCategory && !showAcquire && (
        <div className="mb-3 flex items-center gap-2 rounded-full border border-blue-600/40 bg-blue-600/10 py-1.5 pl-3 pr-1.5 text-xs">
          <span className="flex-1 text-foreground">Visura scaricata?</span>
          <button
            type="button"
            onClick={() => {
              setAcquireCategory(pendingVisuraCategory);
              setShowAcquire(true);
            }}
            className="shrink-0 rounded-full bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700"
          >
            Carica nella pratica
          </button>
        </div>
      )}

      {showAcquire ? (
        <AcquireDocumentForm
          practiceId={practiceId}
          initialCategory={acquireCategory}
          onClose={() => {
            setShowAcquire(false);
            onClearPendingVisura?.();
          }}
          onUploaded={(doc) => {
            setDocuments((prev) => [doc, ...prev]);
            setShowAcquire(false);
            setAcquireCategory(undefined);
            onClearPendingVisura?.();
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setAcquireCategory(undefined);
            setShowAcquire(true);
          }}
          className="mb-3 flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Upload size={13} aria-hidden="true" />
          Acquisisci documento
        </button>
      )}

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        <DocumentGroup
          label="Schema di riferimento"
          items={templates.map((t) => ({
            key: t.template_id,
            name: t.title,
            meta: new Date(t.created_at).toLocaleDateString("it-IT"),
            onOpen: () => handleOpenTemplate(t),
            onDelete: () => handleDeleteTemplate(t),
          }))}
        />
        <DocumentGroup
          label="Dottrina e giurisprudenza di riferimento"
          items={dottrina.map(docToItem)}
        />
        <DocumentGroup label="Visure caricate" items={visure.map(docToItem)} />
        <DocumentGroup label="Documenti di identità delle parti" items={partiIdentita.map(docToItem)} />
        <DocumentGroup label="Altri documenti" items={altri.map(docToItem)} />
      </div>
    </div>
  );
}
