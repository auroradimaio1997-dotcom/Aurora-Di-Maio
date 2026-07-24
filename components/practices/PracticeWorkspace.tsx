"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileDown,
  FileText,
  Landmark,
  Loader2,
  MessageCircleQuestion,
  Plus,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  createTemplate,
  deleteTemplate,
  extractDocumentText,
  listMessages,
  listTemplates,
  postMessage,
  readFileAsBase64,
  saveClausoleAggiuntive,
  updatePracticeStatus,
  uploadDocument,
} from "@/lib/practices/api";
import type { DocumentCategory, Practice, PracticeMessage, PracticeTemplate } from "@/lib/practices/types";
import { PRACTICE_STATUSES } from "@/lib/practices/types";

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
            className="rounded bg-yellow-300/40 px-1 font-sans text-[9pt] font-semibold text-red-700"
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

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadWord(text: string, filename: string) {
  const html = text.replace(/\n/g, "<br/>");
  const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body style="font-family:'Courier New',monospace;font-size:10pt;">${html}</body></html>`;
  const blob = new Blob(["﻿", doc], { type: "application/msword" });
  downloadBlob(blob, `${filename}.doc`);
}

async function downloadPdf(text: string, filename: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text(lines, margin, margin);
  downloadBlob(doc.output("blob"), `${filename}.pdf`);
}

/** Copia / apri / scarica actions shown under each act draft written by Aurora. */
function ActMessageActions({ text, onOpen }: { text: string; onOpen?: () => void }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-black/10 pt-2 font-sans text-secondary">
      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted hover:text-foreground"
        >
          <FileText size={13} aria-hidden="true" />
          Apri atto
        </button>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
        {copied ? "Copiato" : "Copia"}
      </button>
      <button
        type="button"
        onClick={() => downloadWord(text, "atto")}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted hover:text-foreground"
      >
        <FileText size={13} aria-hidden="true" />
        Scarica Word
      </button>
      <button
        type="button"
        onClick={() => downloadPdf(text, "atto")}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted hover:text-foreground"
      >
        <FileDown size={13} aria-hidden="true" />
        Scarica PDF
      </button>
    </div>
  );
}

/** Fullscreen modal to read a drafted act comfortably, with the same actions. */
function ActViewerModal({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="font-serif text-base font-semibold text-black">Atto</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-black/60 hover:bg-black/5 hover:text-black"
            aria-label="Chiudi"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div
          className="select-text overflow-y-auto whitespace-pre-wrap px-6 py-5 text-black"
          style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "10pt", lineHeight: 1.6 }}
        >
          <HighlightedActText text={text} />
        </div>
        <div className="border-t px-5 py-2">
          <ActMessageActions text={text} />
        </div>
      </div>
    </div>
  );
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
  portals,
  helpText,
  helpLink,
}: {
  label: string;
  category: DocumentCategory;
  practiceId: string;
  portals?: { url: string; label: string }[];
  helpText?: string;
  helpLink?: { href: string; label: string };
}) {
  const [open, setOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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
      <div className="flex w-full items-center justify-between px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-1.5 text-left text-xs font-semibold text-secondary hover:text-foreground"
        >
          <span>{label}</span>
        </button>
        {helpText && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowHelp((v) => !v);
            }}
            className="flex shrink-0 items-center gap-1 rounded-full bg-blue-600/15 px-2 py-1 font-semibold text-blue-500 hover:bg-blue-600/25"
            aria-label="Informazioni"
          >
            <MessageCircleQuestion size={16} aria-hidden="true" />
            Info
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 text-secondary hover:text-foreground"
        >
          {open ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
        </button>
      </div>

      {showHelp && helpText && (
        <div className="mx-3 mb-2 rounded-lg border border-blue-600/40 bg-blue-600/10 px-3 py-2.5 text-xs text-foreground">
          <p className="font-medium">{helpText}</p>
          {helpLink && (
            <Link
              href={helpLink.href}
              className="mt-2 inline-block font-semibold text-blue-500 hover:underline"
            >
              {helpLink.label}
            </Link>
          )}
        </div>
      )}

      {open && (
        <div className="space-y-2 border-t p-3 text-xs">
          {portals?.map((portal) => (
            <button
              key={portal.url}
              type="button"
              onClick={() => window.open(portal.url, "_blank", "noopener")}
              className="w-full rounded-full border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
            >
              Apri {portal.label}
            </button>
          ))}
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
 * Free-text extra clauses the notary wants folded into the draft —
 * persisted to the practice record, with an explicit save action and an
 * undo/redo history stack, appended as context whenever a message is sent.
 */
function ClausoleAggiuntiveSection({
  practiceId,
  value,
  onChange,
  savedValue,
  onSaved,
}: {
  practiceId: string;
  value: string;
  onChange: (value: string) => void;
  savedValue: string;
  onSaved: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const dirty = value !== savedValue;

  function handleTextChange(next: string) {
    onChange(next);
    setSaveStatus("idle");
    const truncated = history.slice(0, historyIndex + 1);
    setHistory([...truncated, next]);
    setHistoryIndex(truncated.length);
  }

  function handleUndo() {
    if (historyIndex === 0) return;
    const i = historyIndex - 1;
    setHistoryIndex(i);
    onChange(history[i]);
  }

  function handleRedo() {
    if (historyIndex >= history.length - 1) return;
    const i = historyIndex + 1;
    setHistoryIndex(i);
    onChange(history[i]);
  }

  async function handleSave() {
    setSaveStatus("saving");
    try {
      await saveClausoleAggiuntive(practiceId, value);
      onSaved(value);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div className="mb-3 rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-secondary hover:text-foreground"
      >
        <span className="flex items-center gap-1.5">
          Clausole aggiuntive
          {dirty && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />}
        </span>
        {open ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
      </button>

      {open && (
        <div className="border-t p-3 text-xs">
          <textarea
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={3}
            placeholder="Scrivi qui eventuali clausole da aggiungere all'atto…"
            className="w-full resize-none rounded-md border bg-background px-2 py-1.5 text-foreground"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="rounded-full border px-2.5 py-1 text-secondary hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="rounded-full border px-2.5 py-1 text-secondary hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Ripeti
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || saveStatus === "saving"}
              className="ml-auto rounded-full bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saveStatus === "saving" ? "Salvataggio…" : "Salva modifiche"}
            </button>
          </div>
          {saveStatus === "saved" && !dirty && (
            <p className="mt-1 text-blue-500">Modifiche salvate nella pratica.</p>
          )}
          {saveStatus === "error" && <p className="mt-1 text-destructive">Errore nel salvataggio.</p>}
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
  onPracticeUpdated,
}: {
  practice: Practice;
  onOpenVisuraPortal: (category: "Visure ipocatastali" | "Visure camerali") => void;
  onPracticeUpdated?: (practice: Practice) => void;
}) {
  const [messages, setMessages] = useState<PracticeMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "not-configured" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<PracticeTemplate | null>(null);
  const [clausoleAggiuntive, setClausoleAggiuntive] = useState(practice.clausole_aggiuntive ?? "");
  const [savedClausoleAggiuntive, setSavedClausoleAggiuntive] = useState(practice.clausole_aggiuntive ?? "");
  const [statusSaving, setStatusSaving] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [openActText, setOpenActText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setClausoleAggiuntive(practice.clausole_aggiuntive ?? "");
    setSavedClausoleAggiuntive(practice.clausole_aggiuntive ?? "");
  }, [practice.practice_id]);

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

  async function handleStatusChange(newStatus: string) {
    setStatusSaving(true);
    try {
      const { practice: updated } = await updatePracticeStatus(practice.practice_id, newStatus);
      onPracticeUpdated?.(updated);
    } finally {
      setStatusSaving(false);
    }
  }

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

  async function handleReviewLastDraft() {
    if (status === "loading") return;
    const lastDraft = [...messages].reverse().find((m) => m.role === "aurora")?.text;
    if (!lastDraft) return;
    const reviewPrompt = `Rivedi la seguente bozza di atto notarile (l'ultima versione modificata) in ogni suo aspetto: correttezza grammaticale e ortografica, rispetto della normativa vigente, correttezza delle formalità e delle clausole di stile tipiche di un atto notarile italiano. Segnala puntualmente ogni problema trovato e, dove utile, proponi la correzione.\n\nBOZZA:\n${lastDraft}`;
    await sendToAgent("Revisiona la tua ultima bozza modificata", reviewPrompt);
  }

  async function handleVerificaTassazione() {
    if (status === "loading") return;
    const lastDraft = [...messages].reverse().find((m) => m.role === "aurora")?.text;
    const prompt = lastDraft
      ? `Verifica la tassazione applicabile al seguente atto: indica imposte dovute (registro, ipotecaria, catastale, bollo, ecc.), aliquote applicabili ed eventuali agevolazioni, con riferimenti normativi.\n\nATTO:\n${lastDraft}`
      : "Verifica la tassazione applicabile a questo tipo di atto (nessuna bozza ancora scritta in questa pratica): indica imposte dovute, aliquote applicabili ed eventuali agevolazioni, con riferimenti normativi.";
    await sendToAgent("Verifica tassazione", prompt);
  }

  return (
    <div className="flex h-full min-w-0 flex-1 overflow-hidden">
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden p-4">
        <div className="mb-3 border-b pb-3">
          <h2 className="font-serif text-lg font-semibold text-foreground">{practice.title}</h2>
          <p className="text-xs text-secondary">{practice.practice_type} · {practice.area}</p>
          <div className="mt-2 flex items-center gap-2 rounded-lg border-2 border-blue-600/40 bg-blue-600/10 px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Seleziona stato pratica</span>
            <select
              value={practice.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusSaving}
              className="rounded-full border-2 border-blue-600 bg-background px-3 py-1 text-sm font-semibold text-foreground disabled:opacity-60"
            >
              {PRACTICE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {statusSaving && <Loader2 size={14} className="animate-spin text-blue-600" aria-hidden="true" />}
          </div>
        </div>

        {status === "not-configured" && (
          <p className="mb-3 rounded-lg bg-muted px-3 py-2 text-xs text-secondary">
            Archiviazione permanente in preparazione — il database non è ancora
            collegato sul server.
          </p>
        )}

        {openActText && <ActViewerModal text={openActText} onClose={() => setOpenActText(null)} />}

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
              className="w-full max-w-none rounded-lg border border-black/10 bg-white px-5 py-4 text-black shadow-sm"
            >
              <div
                className="select-text overflow-x-auto whitespace-pre-wrap"
                style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "10pt", lineHeight: 1.5 }}
              >
                <HighlightedActText text={stripMarkdown(m.text)} />
              </div>
              <ActMessageActions
                text={stripMarkdown(m.text)}
                onOpen={() => setOpenActText(stripMarkdown(m.text))}
              />
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

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleVerificaTassazione}
          disabled={status === "loading"}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Landmark size={13} aria-hidden="true" />
          Verifica tassazione (AI)
        </button>

        <button
          type="button"
          onClick={handleReviewLastDraft}
          disabled={status === "loading" || ![...messages].some((m) => m.role === "aurora")}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ClipboardCheck size={13} aria-hidden="true" />
          Revisiona la tua ultima bozza modificata
        </button>

        <label className="flex w-fit cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-muted hover:text-foreground">
          <ClipboardCheck size={13} aria-hidden="true" />
          Revisiona bozza (carica file)
          <input
            type="file"
            accept="application/pdf,.docx,.txt"
            onChange={handleReviewDraft}
            disabled={status === "loading"}
            className="hidden"
          />
        </label>
      </div>

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

      {sectionsOpen ? (
        <div className="flex h-full w-72 shrink-0 flex-col overflow-y-auto border-l bg-background p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Carica documenti</h3>
            <button
              type="button"
              onClick={() => setSectionsOpen(false)}
              className="rounded-full p-1 text-secondary hover:bg-muted hover:text-foreground"
              aria-label="Richiudi carica documenti"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-0">
            <CategoryUploadSection
          label="Dottrina e giurisprudenza di riferimento"
          category="Dottrina e Giurisprudenza"
          practiceId={practice.practice_id}
          portals={[
            { url: "https://onelegale.wolterskluwer.it", label: "OneLegale" },
            { url: "https://cnnnotizie.notariato.it", label: "Banche dati notarili" },
          ]}
          helpText="Carica o cerca tu manualmente dottrina e giurisprudenza che ritieni l'AI non abbia trovato."
          helpLink={{
            href: "/assistente-notarile/ricerca-scientifica",
            label: "Vuoi approfondire con l'AI? Vai a Fai una ricerca scientifica approfondita →",
          }}
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
          portals={[{ url: SMARTACCESS_URL, label: "SmartRUN — Anagrafica" }]}
        />

        {practice.practice_type === "Societario" && (
          <>
            <CategoryUploadSection
              label="Bilancio"
              category="Bilancio"
              practiceId={practice.practice_id}
              portals={[{ url: SMARTACCESS_URL, label: "SmartRUN" }]}
            />
            <CategoryUploadSection
              label="Situazione Patrimoniale Aggiornata"
              category="Situazione Patrimoniale Aggiornata"
              practiceId={practice.practice_id}
              portals={[{ url: SMARTACCESS_URL, label: "SmartRUN" }]}
            />
            <CategoryUploadSection
              label="Verbali Adunanze Soci e CDA"
              category="Verbali Adunanze Soci e CDA"
              practiceId={practice.practice_id}
              portals={[{ url: SMARTACCESS_URL, label: "SmartRUN" }]}
            />
            <CategoryUploadSection
              label="Altri Verbali"
              category="Altri Verbali"
              practiceId={practice.practice_id}
              portals={[{ url: SMARTACCESS_URL, label: "SmartRUN" }]}
            />
          </>
        )}

            <ClausoleAggiuntiveSection
              practiceId={practice.practice_id}
              value={clausoleAggiuntive}
              onChange={setClausoleAggiuntive}
              savedValue={savedClausoleAggiuntive}
              onSaved={setSavedClausoleAggiuntive}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setSectionsOpen(true)}
          className="flex h-full w-10 shrink-0 items-center justify-center border-l text-secondary hover:bg-muted hover:text-foreground"
          aria-label="Apri carica documenti"
        >
          <Upload size={16} aria-hidden="true" />
        </button>
      )}

    </div>
  );
}
