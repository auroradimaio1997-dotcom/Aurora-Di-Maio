"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, FileDown, FileText, Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { listPractices, postMessage, uploadDocument, PracticeStorageNotConfiguredError } from "@/lib/practices/api";
import type { Practice } from "@/lib/practices/types";

type ResearchMessage = {
  role: "user" | "aurora";
  text: string;
  savedToPracticeTitle?: string;
};

function stripMarkdown(text: string) {
  return text
    .replace(/[#*_`>]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim();
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

function downloadWord(text: string, index: number) {
  const plain = stripMarkdown(text).replace(/\n/g, "<br/>");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><p>${plain}</p></body></html>`;
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  downloadBlob(blob, `ricerca-${index + 1}.doc`);
}

async function downloadPdf(text: string, index: number) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const lines = doc.splitTextToSize(stripMarkdown(text), maxWidth);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(lines, margin, margin);
  downloadBlob(doc.output("blob"), `ricerca-${index + 1}.pdf`);
}

function textToBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function MessageActions({ text, index }: { text: string; index: number }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(stripMarkdown(text));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-2 flex items-center gap-1 text-secondary">
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
        onClick={() => downloadWord(text, index)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted hover:text-foreground"
      >
        <FileText size={13} aria-hidden="true" />
        Scarica Word
      </button>
      <button
        type="button"
        onClick={() => downloadPdf(text, index)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted hover:text-foreground"
      >
        <FileDown size={13} aria-hidden="true" />
        Scarica PDF
      </button>
    </div>
  );
}

/**
 * Shared AI research tool for the three "Ricerca scientifica
 * approfondita" areas (dottrinale, giurisprudenziale, banche dati
 * notarili). Before asking, the notary picks which open practice this
 * research belongs to — the exchange is then automatically logged into
 * that practice's own chat AND saved as a document under "Dottrina e
 * Giurisprudenza", so it's there when working the act. Always
 * downloadable here too, practice selected or not.
 */
export default function ResearchTool({
  title,
  description,
  promptFrame,
}: {
  title: string;
  description: string;
  promptFrame: string;
}) {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [selectedPracticeId, setSelectedPracticeId] = useState("");
  const [messages, setMessages] = useState<ResearchMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listPractices()
      .then(({ practices }) => setPractices(practices))
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "loading") return;
    setInput("");
    setStatus("loading");
    setErrorMsg("");

    const selectedPractice = practices.find((p) => p.practice_id === selectedPracticeId);
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const res = await fetch("/api/agente-coordinatore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `${promptFrame}\n\nRichiesta: ${text}` }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Errore nella risposta.");
      }
      const answer = data.risposta || "Nessuna risposta ricevuta.";

      let savedToPracticeTitle: string | undefined;
      if (selectedPractice) {
        try {
          await postMessage(selectedPractice.practice_id, { role: "user", text });
          await postMessage(selectedPractice.practice_id, { role: "aurora", text: answer });
          await uploadDocument(selectedPractice.practice_id, {
            name: `Ricerca - ${text.slice(0, 60)}.txt`,
            category: "Dottrina e Giurisprudenza",
            mimeType: "text/plain",
            dataBase64: textToBase64(answer),
          });
          savedToPracticeTitle = selectedPractice.title;
        } catch (saveErr) {
          if (!(saveErr instanceof PracticeStorageNotConfiguredError)) throw saveErr;
        }
      }

      setMessages((prev) => [...prev, { role: "aurora", text: answer, savedToPracticeTitle }]);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Errore imprevisto. Riprova.");
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-65px)] max-w-3xl flex-col px-6 py-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-secondary">{description}</p>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-secondary">
          Collega questa ricerca alla pratica (facoltativo)
        </label>
        <select
          value={selectedPracticeId}
          onChange={(e) => setSelectedPracticeId(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Nessuna — solo qui</option>
          {practices.map((p) => (
            <option key={p.practice_id} value={p.practice_id}>
              {p.title} · {p.practice_type}
            </option>
          ))}
        </select>
      </div>

      <div ref={scrollRef} className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto py-2">
        {messages.length === 0 && (
          <p className="text-sm text-secondary">Scrivi la tua domanda di ricerca qui sotto.</p>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="max-w-[85ch] select-text text-[15px] leading-7 text-foreground">
              <div className="space-y-2 [&_a]:text-blue-500 [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_li]:mt-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
              {m.savedToPracticeTitle && (
                <p className="mt-1 text-xs text-blue-500">
                  Salvata nella pratica &quot;{m.savedToPracticeTitle}&quot;.
                </p>
              )}
              <MessageActions text={m.text} index={i} />
            </div>
          )
        )}
        {status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            Sto cercando…
          </div>
        )}
        {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2 rounded-full border bg-background px-2 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi la tua ricerca…"
          disabled={status === "loading"}
          className="flex-1 bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-secondary focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Invia ricerca"
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
