"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, Copy, FileDown, FileText, Loader2, Paperclip, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Attachment = {
  name: string;
  isImage: boolean;
  dataUrl: string;
};

type Message = {
  role: "user" | "aurora";
  text: string;
  attachment?: Attachment;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-blue-500"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
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
 * api/agente-coordinatore.js. ChatGPT-style layout: the user's own
 * messages get a blue pill; assistant replies render as continuous,
 * selectable text with no box/border, exactly like ChatGPT.
 */
export default function ChatWidget({
  onNewConversation,
}: {
  onNewConversation?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setAttachment({ name: file.name, isImage: file.type.startsWith("image/"), dataUrl });
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if ((!text && !attachment) || status === "loading") return;

    const currentAttachment = attachment;
    setMessages((prev) => [
      ...prev,
      { role: "user", text, attachment: currentAttachment ?? undefined },
    ]);
    setInput("");
    setAttachment(null);
    setStatus("loading");
    setErrorMsg("");

    const messageForAgent = currentAttachment
      ? `${text}\n\n[File allegato: ${currentAttachment.name}]`.trim()
      : text;

    try {
      const res = await fetch("/api/agente-coordinatore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageForAgent }),
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
            Cosa ti serve al momento?
          </p>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-2.5 text-sm leading-relaxed text-white shadow-md">
                {m.attachment && (
                  <div className="mb-2">
                    {m.attachment.isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.attachment.dataUrl}
                        alt={m.attachment.name}
                        className="max-h-40 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-xs">
                        <FileText size={14} aria-hidden="true" />
                        {m.attachment.name}
                      </div>
                    )}
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="max-w-[85ch] select-text text-[15px] leading-7 text-foreground">
              <div className="space-y-2 [&_a]:text-blue-500 [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_li]:mt-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
              <MessageActions text={m.text} index={i} />
            </div>
          )
        )}

        {status === "loading" && <TypingIndicator />}

        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        {attachment && (
          <div className="mb-2 flex items-center gap-2 rounded-xl border bg-muted px-3 py-2 text-xs text-secondary">
            {attachment.isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={attachment.dataUrl} alt={attachment.name} className="h-8 w-8 rounded object-cover" />
            ) : (
              <FileText size={14} aria-hidden="true" />
            )}
            <span className="flex-1 truncate">{attachment.name}</span>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="rounded-full p-1 text-secondary hover:bg-background hover:text-foreground"
              aria-label="Rimuovi allegato"
            >
              <X size={13} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-full border bg-background px-2 py-2 shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-secondary transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Allega file o foto"
          >
            <Paperclip size={17} aria-hidden="true" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi un messaggio…"
            maxLength={2000}
            disabled={status === "loading"}
            className="flex-1 bg-transparent px-1 py-1.5 text-sm text-foreground placeholder:text-secondary focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading" || (!input.trim() && !attachment)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Invia messaggio"
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
