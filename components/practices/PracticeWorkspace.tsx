"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { listMessages, postMessage } from "@/lib/practices/api";
import type { Practice, PracticeMessage } from "@/lib/practices/types";

/**
 * Chat scoped to a single practice. Persists real messages via the
 * practices API (Supabase) — no specialist agent is wired yet, so the
 * assistant side stays an honest "Agente in preparazione" placeholder
 * rather than a simulated AI answer.
 */
export default function PracticeWorkspace({ practice }: { practice: Practice }) {
  const [messages, setMessages] = useState<PracticeMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "not-configured" | "error">("idle");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "loading") return;
    setInput("");
    setStatus("loading");
    try {
      const { message: userMessage } = await postMessage(practice.practice_id, {
        role: "user",
        text,
      });
      const { message: auroraMessage } = await postMessage(practice.practice_id, {
        role: "aurora",
        text: `Agente specialistico (${practice.agent_id}) in preparazione — il messaggio è stato salvato nella pratica.`,
      });
      setMessages((prev) => [...prev, userMessage, auroraMessage]);
      setStatus("idle");
    } catch (err) {
      if (err instanceof Error && err.name === "PracticeStorageNotConfiguredError") {
        setStatus("not-configured");
      } else {
        setStatus("error");
      }
    }
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col p-4">
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

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto py-2">
        {messages.length === 0 && (
          <p className="text-sm text-secondary">Nessun messaggio ancora in questa pratica.</p>
        )}
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.message_id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm">
                {m.text}
              </div>
            </div>
          ) : (
            <p key={m.message_id} className="max-w-[85ch] text-[15px] leading-7 text-foreground">
              {m.text}
            </p>
          )
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2 rounded-full border bg-background px-2 py-2">
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
