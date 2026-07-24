"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ChevronDown, ChevronRight, ClipboardCheck, FileText, Loader2, Plus, Send, Trash2 } from "lucide-react";
import {
  createTemplate,
  deleteTemplate,
  extractDocumentText,
  listMessages,
  listTemplates,
  postMessage,
  readFileAsBase64,
  uploadDocument,
} from "@/lib/practices/api";
import type { DocumentCategory, Practice, PracticeMessage, PracticeTemplate } from "@/lib/practices/types";

const PLACEHOLDER_SPLIT_PATTERN = /(\[[^\]\n]+\])/g;
const PLACEHOLDER_TEST_PATTERN = /^\[[^\]\n]+\]$/;

/** Renders act text with [SEGNAPOSTO] placeholders highlighted so the
 * notary immediately sees what still needs to be filled in. */
function HighlightedActText({ text }: { text: string }) {
  const parts = text.split(PLACEHOLDER_SPLIT_PATTERN);
  return (
    <>
      {parts.map((part, i) =>
        PLACEHOLDER_TEST_PATTERN.test(part) ? (
          <mark
            key={i}
            className="rounded bg-yellow-300/40 px-1 font-sans text-[9pt] font-semibold text-yellow-800 dark:text-yellow-200"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function stripMarkdown(text: string) {
  return text
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*([-*_])\s*\1\s*\1[-*_\s]*$/gm, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1");
}

function SchemaSection({
  practiceType,
  activeTemplateId,
  onActiveTemplateChange,
}: {
  practiceType: string;
  activeTemplateId: string | null;
  onActiveTemplateChange: (template: PracticeTemplate | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<PracticeTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listTemplates(practiceType)
      .then(({ templates }) => {
        if (!cancelled) setTemplates(templates);
      })
      .catch((err) => {
        if (!cancelled && err?.name === "PracticeStorageNotConfiguredError") {
          setNotConfigured(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [practiceType]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  async function handleSave() {
    if (!title.trim() || !file) return;
    setSaving(true);
    try {
      const dataBase64 = await readFileAsBase64(file);
      const { template } = await createTemplate({
        practiceType,
        title: title.trim(),
        notes: notes.trim() || undefined,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        dataBase64,
      });
      setTemplates((prev) => [template, ...prev]);
      setTitle("");
      setNotes("");
      setFile(null);
      setShowForm(false);
      onActiveTemplateChange(template);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(templateId: string) {
    if (!window.confirm("Eliminare questo schema?")) return;
    await deleteTemplate(templateId);
    setTemplates((prev) => prev.filter((t) => t.template_id !== templateId));
    if (activeTemplateId === templateId) onActiveTemplateChange(null);
  }

  return (
    <div className="mb-3 rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-secondary hover:text-foreground"
      >
        <span>Schema di riferimento ({templates.length})</span>
        {open ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
      </button>

      {open && (
        <div className="border-t p-3 text-xs">
          {notConfigured && (
            <p className="mb-2 text-secondary">Archiviazione permanente in preparazione.</p>
          )}

          {templates.length === 0 && !showForm && (
            <p className="mb-2 text-secondary">
              Nessuno schema salvato per &quot;{practiceType}&quot;. Carica il file del tuo
              modello per farlo seguire alla chat quando scrive un atto.
            </p>
          )}

          <div className="mb-2 space-y-1">
            {templates.map((t) => (
              <div
                key={t.template_id}
                className={`rounded-md px-2 py-1.5 ${
                  activeTemplateId === t.template_id ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onActiveTemplateChange(activeTemplateId === t.template_id ? null : t)
                    }
                    className="flex flex-1 items-center gap-1.5 truncate text-left text-foreground"
                  >
                    <FileText size={12} className="shrink-0" aria-hidden="true" />
                    {activeTemplateId === t.template_id ? "✓ " : ""}
                    {t.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.template_id)}
                    className="text-secondary hover:text-destructive"
                    aria-label="Elimina schema"
                  >
                    <Trash2 size={12} aria-hidden="true" />
                  </button>
                </div>
                {t.notes && <p className="mt-1 pl-5 text-secondary">{t.notes}</p>}
              </div>
            ))}
          </div>

          {showForm ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome schema (es. Donazione immobiliare)"
                className="w-full rounded-md border bg-background px-2 py-1.5 text-foreground"
              />
              <input
                type="file"
                accept="application/pdf,.docx,.doc"
                onChange={handleFileChange}
                className="w-full text-foreground"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Rispetto a questo schema, cambia questo…"
                className="w-full resize-none rounded-md border bg-background px-2 py-1.5 text-foreground"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!title.trim() || !file || saving}
                  className="flex-1 rounded-full bg-blue-600 py-1.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Caricamento…" : "Salva schema"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border px-3 py-1.5 text-secondary"
                >
                  Annulla
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-secondary hover:bg-muted"
            >
              <Plus size={12} aria-hidden="true" />
              Carica schema
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact collapsed-by-default upload shortcut for a single fixed
 * document category — Dottrina e Giurisprudenza and Documenti delle
 * parti both use this. Actually viewing what's been uploaded lives in
 * the side documents panel, not here; this is acquisition only.
 */
function CategoryUploadSection({
  label,
  category,
  practiceId,
  portalUrl,
  portalLabel,
}: {
  label: string;
  category: DocumentCategory;
  practiceId: string;
  portalUrl?: string;
  portalLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error" | "not-configured">("idle");

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    try {
      const dataBase64 = await readFileAsBase64(file);
      await uploadDocument(practiceId, {
        name: file.name,
        category,
        mimeType: file.type || "application/octet-stream",
        dataBase64,
      });
      setFile(null);
      setStatus("done");
    } catch (err) {
      if (err instanceof Error && err.name === "PracticeStorageNotConfiguredError") {
        setStatus("not-configured");
      } else {
        setStatus("error");
      }
    }
  }

  return (
    <div className="mb-3 rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-secondary hover:text-foreground"
      >
        <span>{label}</span>
        {open ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
      </button>

      {open && (
        <div className="space-y-2 border-t p-3 text-xs">
          {portalUrl && (
            <button
              type="button"
              onClick={() => window.open(portalUrl, "_blank", "noopener")}
              className="w-full rounded-full border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
            >
              Apri {portalLabel}
            </button>
          )}
          <input
            type="file"
            accept="application/pdf,.docx,.doc,image/jpeg,image/png"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setStatus("idle");
            }}
            className="w-full text-foreground"
          />
          {status === "done" && <p className="text-blue-500">Caricato nella pratica.</p>}
          {status === "not-configured" && (
            <p className="text-secondary">Archiviazione permanente in preparazione.</p>
          )}
          {status === "error" && <p className="text-destructive">Errore nel caricamento.</p>}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || status === "uploading"}
            className="w-full rounded-full bg-blue-600 py-1.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "uploading" ? "Caricamento…" : "Carica nella pratica"}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Free-text extra clauses the notary wants folded into the draft — kept
 * for the current session only (not persisted), appended as context
 * whenever a message is sent.
 */
function ClausoleAggiuntiveSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-secondary hover:text-foreground"
      >
        <span>Clausole aggiuntive</span>
        {open ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
      </button>

      {open && (
        <div className="border-t p-3 text-xs">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            placeholder="Scrivi qui eventuali clausole da aggiungere all'atto…"
            className="w-full resize-none rounded-md border bg-background px-2 py-1.5 text-foreground"
          />
        </div>
      )}
    </div>
  );
}

const SMARTACCESS_URL = "https://webrun.notariato.it/smartaccess/";

function VisureHub({ onOpenPortal }: { onOpenPortal: (category: "Visure ipocatastali" | "Visure camerali") => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-secondary hover:text-foreground"
      >
        <span>Visure</span>
        {open ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
      </button>

      {open && (
        <div className="flex gap-2 border-t p-3 text-xs">
          <button
            type="button"
            onClick={() => onOpenPortal("Visure ipocatastali")}
            className="flex-1 rounded-full border px-3 py-2 font-medium text-foreground hover:bg-muted"
          >
            Visura ipocatastale
          </button>
          <button
            type="button"
            onClick={() => onOpenPortal("Visure camerali")}
            className="flex-1 rounded-full border px-3 py-2 font-medium text-foreground hover:bg-muted"
          >
            Visura camerale
          </button>
        </div>
      )}
    </div>
  );
}

export default function PracticeWorkspace({
  practice,
  onOpenVisuraPortal,
}: {
  practice: Practice;
  onOpenVisuraPortal: (category: "Visure ipocatastali" | "Visure camerali") => void;
}) {
  const [messages, setMessages] = useState<PracticeMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "not-configured" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<PracticeTemplate | null>(null);
  const [clausoleAggiuntive, setClausoleAggiuntive] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    listMessages(practice.practice_id)
      .then(({ messages }) => {
        if (!cancelled) setMessages(messages);
      })
      .catch((err) => {
        if (!cancelled && err?.name === "PracticeStorageNotConfiguredError") {
          setStatus("not-configured");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [practice.practice_id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  /**
   * Posts a user-visible message and sends the agent an optionally
   * different, richer prompt (schema/clausole context, or a full draft
   * to review). Shared by normal chat submission and "Revisiona bozza".
   */
  async function sendToAgent(displayText: string, agentMessage: string) {
    setStatus("loading");
    setErrorMsg("");

    try {
      const { message: userMessage } = await postMessage(practice.practice_id, {
        role: "user",
        text: displayText,
      });
      setMessages((prev) => [...prev, userMessage]);

      const res = await fetch("/api/agente-coordinatore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: agentMessage }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Errore nella risposta.");
      }

      const { message: auroraMessage } = await postMessage(practice.practice_id, {
        role: "aurora",
        text: data.risposta || "Nessuna risposta ricevuta.",
      });
      setMessages((prev) => [...prev, auroraMessage]);
      setStatus("idle");
    } catch (err) {
      if (err instanceof Error && err.name === "PracticeStorageNotConfiguredError") {
        setStatus("not-configured");
      } else {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Errore imprevisto. Riprova.");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "loading") return;
    setInput("");

    let contextualMessage = text;
    if (activeTemplate) {
      const schemaText = activeTemplate.content
        ? `Segui questo schema come modello per la redazione:\n\n${activeTemplate.content}`
        : `Segui lo schema "${activeTemplate.title}" come modello per la redazione (il testo non è stato estratto automaticamente dal file).`;
      const notesText = activeTemplate.notes
        ? `\n\nRispetto allo schema, tieni conto di questo: ${activeTemplate.notes}`
        : "";
      contextualMessage = `${schemaText}${notesText}\n\nRichiesta: ${text}`;
    }
    if (clausoleAggiuntive.trim()) {
      contextualMessage = `${contextualMessage}\n\nClausole aggiuntive da inserire nell'atto: ${clausoleAggiuntive.trim()}`;
    }

    await sendToAgent(text, contextualMessage);
  }

  async function handleReviewDraft(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");
    try {
      const dataBase64 = await readFileAsBase64(file);
      const { text } = await extractDocumentText({
        mimeType: file.type || "application/octet-stream",
        fileName: file.name,
        dataBase64,
      });
      const reviewPrompt = `Rivedi la seguente bozza di atto notarile in ogni suo aspetto: correttezza grammaticale e ortografica, rispetto della normativa vigente, correttezza delle formalità e delle clausole di stile tipiche di un atto notarile italiano. Segnala puntualmente ogni problema trovato e, dove utile, proponi la correzione.\n\nBOZZA:\n${text}`;
      await sendToAgent(`Revisione bozza: ${file.name}`, reviewPrompt);
    } catch (err) {
      if (err instanceof Error && err.name === "PracticeStorageNotConfiguredError") {
        setStatus("not-configured");
      } else {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Errore nell'estrazione del file.");
      }
    }
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden p-4">
      <div className="mb-3 border-b pb-3">
        <h2 className="font-serif text-lg font-semibold text-foreground">{practice.title}</h2>
        <p className="text-xs text-secondary">
          {practice.practice_type} · {practice.area} · {practice.status}
        </p>
      </div>

      {status === "not-configured" && (
        <p className="mb-3 rounded-lg bg-muted px-3 py-2 text-xs text-secondary">
          Archiviazione permanente in preparazione — il database non è ancora
          collegato sul server.
        </p>
      )}

      <div className="max-h-56 shrink-0 space-y-0 overflow-y-auto pr-1">
        <CategoryUploadSection
          label="Dottrina e giurisprudenza di riferimento"
          category="Dottrina e Giurisprudenza"
          practiceId={practice.practice_id}
          portalUrl="https://onelegale.wolterskluwer.it"
          portalLabel="OneLegale"
        />

        <SchemaSection
          practiceType={practice.practice_type}
          activeTemplateId={activeTemplate?.template_id ?? null}
          onActiveTemplateChange={setActiveTemplate}
        />

        <VisureHub
          onOpenPortal={(category) => {
            window.open(SMARTACCESS_URL, "_blank", "noopener");
            onOpenVisuraPortal(category);
          }}
        />

        <CategoryUploadSection
          label="Documenti di identità delle parti"
          category="Documenti delle parti"
          practiceId={practice.practice_id}
        />

        <CategoryUploadSection
          label="Dichiarazione di Successione"
          category="Dichiarazione di Successione"
          practiceId={practice.practice_id}
        />

        <CategoryUploadSection
          label="Certificato di morte"
          category="Certificato di Morte"
          practiceId={practice.practice_id}
        />

        <CategoryUploadSection
          label="Regime patrimoniale"
          category="Regime Patrimoniale"
          practiceId={practice.practice_id}
          portalUrl={SMARTACCESS_URL}
          portalLabel="SmartRUN — Anagrafica"
        />

        <ClausoleAggiuntiveSection value={clausoleAggiuntive} onChange={setClausoleAggiuntive} />
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto py-2">
        {messages.length === 0 && (
          <p className="text-sm text-secondary">
            Scrivi qui per redigere l&apos;atto. Se hai selezionato uno schema sopra, la
            bozza lo seguirà.
          </p>
        )}
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.message_id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm">
                {m.text}
              </div>
            </div>
          ) : (
            <div
              key={m.message_id}
              className="max-w-[85ch] select-text whitespace-pre-wrap text-foreground"
              style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "10pt", lineHeight: 1.5 }}
            >
              <HighlightedActText text={stripMarkdown(m.text)} />
            </div>
          )
        )}
        {status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            Sto scrivendo…
          </div>
        )}
        {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
      </div>

      <label className="mt-3 flex w-fit cursor-pointer items-center gap-1.5 self-end rounded-full border px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-muted hover:text-foreground">
        <ClipboardCheck size={13} aria-hidden="true" />
        Revisiona bozza
        <input
          type="file"
          accept="application/pdf,.docx,.txt"
          onChange={handleReviewDraft}
          disabled={status === "loading"}
          className="hidden"
        />
      </label>

      <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2 rounded-full border bg-background px-2 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi nella pratica…"
          disabled={status === "loading"}
          className="flex-1 bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-secondary focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Invia messaggio"
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <Send size={16} aria-hidden="true" />
          )}
        </button>
      </form>
    </div>
  );
}
