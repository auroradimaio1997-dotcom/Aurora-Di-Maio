"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Copy, FileDown, FileText, Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "aurora";
  text: string;
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
  a.click();
  URL.revokeObjectURL(url);
}

function downloadWord(text: string, index: number) {
  const plain = stripMarkdown(text).replace(/\n/g, "<br/>");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><p>${plain}</p></body></html>`;
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  downloadBlob(blob, `risposta-aurora-${index + 1}.doc`);
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
  doc.save(`risposta-aurora-${index + 1}.pdf`);
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
 * The live chat with the Aurora coordinatore agent — proxied through
 * api/agente-coordinatore.js. ChatGPT-style layout: assistant replies are
 * continuous, selectable text (no boxed bubble); only the user's own
 * messages get a subtle pill for turn-taking clarity.
 */
export default function ChatWidget({
  onNewConversation,
}: {
  onNewConversation?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "loading") return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/agente-coordinatore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore nella risposta.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "aurora", text: data.risposta || "Nessuna risposta ricevuta." },
      ]);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Errore imprevisto. Riprova.");
    }
  }

  return (
    <div className="mt-6 flex min-h-0 flex-1 flex-col">
      {onNewConversation && messages.length > 0 && (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onNewConversation}
            className="rounded-full px-3 py-1 text-xs font-medium text-secondary transition-colors hover:bg-muted hover:text-foreground"
          >
            Nuova conversazione
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className={
          messages.length === 0
            ? "flex flex-1 items-center justify-center py-2"
            : "flex-1 space-y-5 overflow-y-auto py-2"
        }
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p className="text-sm text-secondary">
            Scrivi un messaggio per iniziare a parlare con l&apos;assistente.
          </p>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="max-w-[85ch] select-text text-[15px] leading-7 text-foreground">
              <div className="space-y-2 [&_a]:text-gold [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_li]:mt-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
              <MessageActions text={m.text} index={i} />
            </div>
          )
        )}

        {status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            Sto pensando…
          </div>
        )}

        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 rounded-full border bg-background px-2 py-2 shadow-sm"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio…"
          maxLength={2000}
          disabled={status === "loading"}
          className="flex-1 bg-transparent px-3 py-1.5 text-sm text-foreground placeholder:text-secondary focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-navy transition-colors hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
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
