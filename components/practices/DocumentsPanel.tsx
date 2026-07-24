"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Download, FileText, Trash2, Upload, X } from "lucide-react";
import {
  deleteDocument,
  getDocumentSignedUrl,
  listDocuments,
  readFileAsBase64,
  uploadDocument,
} from "@/lib/practices/api";
import { DOCUMENT_CATEGORIES, type DocumentCategory, type PracticeDocument } from "@/lib/practices/types";

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
    <div className="mb-3 rounded-lg border bg-muted p-3 text-xs">
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
        {status === "uploading" ? "Caricamento…" : "Conferma caricamento"}
      </button>
    </div>
  );
}

export default function DocumentsPanel({
  practiceId,
  collapsed,
  onToggleCollapsed,
  pendingVisuraCategory,
  onClearPendingVisura,
}: {
  practiceId: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  pendingVisuraCategory?: DocumentCategory | null;
  onClearPendingVisura?: () => void;
}) {
  const [documents, setDocuments] = useState<PracticeDocument[]>([]);
  const [notConfigured, setNotConfigured] = useState(false);
  const [showAcquire, setShowAcquire] = useState(false);
  const [acquireCategory, setAcquireCategory] = useState<DocumentCategory | undefined>(undefined);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    listDocuments(practiceId)
      .then(({ documents }) => {
        if (!cancelled) setDocuments(documents);
      })
      .catch((err) => {
        if (!cancelled && err?.name === "PracticeStorageNotConfiguredError") {
          setNotConfigured(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [practiceId]);

  async function handleOpen(doc: PracticeDocument) {
    const { url } = await getDocumentSignedUrl(practiceId, doc.document_id);
    window.open(url, "_blank", "noopener");
  }

  async function handleDelete(doc: PracticeDocument) {
    if (!window.confirm(`Eliminare "${doc.name}"? L'operazione non è reversibile.`)) return;
    await deleteDocument(practiceId, doc.document_id);
    setDocuments((prev) => prev.filter((d) => d.document_id !== doc.document_id));
  }

  const byCategory = documents.reduce<Record<string, PracticeDocument[]>>((acc, doc) => {
    (acc[doc.category] ??= []).push(doc);
    return acc;
  }, {});

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
        <div className="mb-3 rounded-lg border border-blue-600/40 bg-blue-600/10 p-3 text-xs">
          <p className="mb-2 text-foreground">
            Hai scaricato la {pendingVisuraCategory.toLowerCase()}? Caricala qui.
          </p>
          <button
            type="button"
            onClick={() => {
              setAcquireCategory(pendingVisuraCategory);
              setShowAcquire(true);
            }}
            className="w-full rounded-full bg-blue-600 py-1.5 font-semibold text-white hover:bg-blue-700"
          >
            Carica la visura
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
        {Object.keys(byCategory).length === 0 && (
          <p className="text-xs text-secondary">Nessun documento ancora caricato.</p>
        )}
        {Object.entries(byCategory).map(([category, docs]) => {
          const open = openCategories[category] ?? true;
          return (
            <div key={category}>
              <button
                type="button"
                onClick={() =>
                  setOpenCategories((prev) => ({ ...prev, [category]: !open }))
                }
                className="flex w-full items-center gap-1 rounded-md px-1 py-1.5 text-left text-xs font-semibold text-secondary hover:text-foreground"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform ${open ? "" : "-rotate-90"}`}
                  aria-hidden="true"
                />
                {category} ({docs.length})
              </button>
              {open &&
                docs.map((doc) => (
                  <div key={doc.document_id} className="ml-4 mb-2 rounded-lg border p-2 text-xs">
                    <p className="truncate font-medium text-foreground">{doc.name}</p>
                    <p className="mt-0.5 text-secondary">
                      {formatSize(doc.size_bytes)} · {new Date(doc.uploaded_at).toLocaleDateString("it-IT")}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpen(doc)}
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-secondary hover:bg-muted hover:text-foreground"
                      >
                        <Download size={12} aria-hidden="true" />
                        Apri
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc)}
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-secondary hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={12} aria-hidden="true" />
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
