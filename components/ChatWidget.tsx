"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";

type Message = {
  role: "user" | "aurora";
  text: string;
};

/**
 * The live chat with the Aurora coordinatore agent — proxied through
 * api/agente-coordinatore.js so the Codewords API key stays server-side.
 */
export default function ChatWidget() {
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
    <div className="mt-10 rounded-xl border bg-background">
      <div
        ref={scrollRef}
        className="h-96 space-y-3 overflow-y-auto p-5"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p className="text-sm text-secondary">
            Scrivi un messaggio per iniziare a parlare con l&apos;assistente.
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-navy text-foreground"
                : "border bg-background text-foreground"
            }`}
          >
            {m.text}
          </div>
        ))}

        {status === "loading" && (
          <div className="flex max-w-[85%] items-center gap-2 rounded-xl border px-4 py-2.5 text-sm text-secondary">
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
        className="flex items-center gap-2 border-t p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio…"
          maxLength={2000}
          disabled={status === "loading"}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-md bg-cta text-on-primary transition-colors hover:bg-cta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
