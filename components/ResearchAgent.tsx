"use client";

import { useState, type FormEvent } from "react";
import { Bot, Loader2 } from "lucide-react";

type Result = {
  pdf?: string;
  titolo_saggio?: string;
  articoli_analizzati?: number;
};

export default function ResearchAgent() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const tema = String(form.get("tema") || "").trim();

    if (!tema) {
      setStatus("error");
      setErrorMsg("Indica un tema di ricerca.");
      return;
    }

    const payload: Record<string, unknown> = {
      tema,
      max_articoli: Number(form.get("max_articoli")) || 4,
    };
    const anno = form.get("anno");
    if (anno) payload.anno = Number(anno);

    setStatus("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/agente-ricerca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore nella generazione.");
      }

      setResult(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Errore imprevisto.");
    }
  }

  return (
    <section aria-labelledby="agent-heading" className="rounded-xl bg-primary">
      <div className="flex flex-col gap-6 px-6 py-10 md:px-10">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-on-primary/10 text-on-primary">
            <Bot size={24} aria-hidden="true" />
          </span>
          <div>
            <h2
              id="agent-heading"
              className="font-serif text-2xl font-semibold text-on-primary"
            >
              Agent Accademia
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-on-primary/70">
              Indica un tema di diritto: l&apos;agente cerca e analizza gli
              articoli pertinenti e prepara un saggio in PDF. Richiede qualche
              minuto — resta su questa pagina. Verifica sempre il risultato
              prima di qualunque uso accademico.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-lg bg-on-primary/5 p-5 md:grid-cols-[1fr_auto_auto_auto]"
        >
          <div className="md:col-span-4">
            <label
              htmlFor="tema"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-on-primary/60"
            >
              Tema di ricerca
            </label>
            <textarea
              id="tema"
              name="tema"
              rows={2}
              maxLength={300}
              required
              placeholder="Es. la responsabilità precontrattuale nel diritto civile italiano"
              className="w-full rounded-md border border-on-primary/20 bg-transparent px-3 py-2 text-sm text-on-primary placeholder:text-on-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="max_articoli"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-on-primary/60"
            >
              N. articoli
            </label>
            <input
              id="max_articoli"
              name="max_articoli"
              type="number"
              min={1}
              max={10}
              defaultValue={4}
              className="w-24 rounded-md border border-on-primary/20 bg-transparent px-3 py-2 text-sm text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="anno"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-on-primary/60"
            >
              Anno
            </label>
            <input
              id="anno"
              name="anno"
              type="number"
              min={1950}
              max={2100}
              placeholder="2024"
              className="w-24 rounded-md border border-on-primary/20 bg-transparent px-3 py-2 text-sm text-on-primary placeholder:text-on-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-cta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-progress disabled:opacity-60"
            >
              {status === "loading" && (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              )}
              Genera saggio
            </button>
          </div>
        </form>

        {status === "loading" && (
          <p className="text-sm text-on-primary/70">
            L&apos;agente sta cercando e analizzando gli articoli — può
            richiedere alcuni minuti.
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}

        {status === "success" && result && (
          <div className="rounded-lg bg-on-primary/5 p-5">
            <p className="font-serif text-lg font-semibold text-on-primary">
              {result.titolo_saggio || "Saggio generato"}
            </p>
            {typeof result.articoli_analizzati === "number" && (
              <p className="mt-1 text-xs uppercase tracking-wide text-on-primary/60">
                {result.articoli_analizzati} articoli analizzati
              </p>
            )}
            {result.pdf && (
              <a
                href={result.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-on-primary underline underline-offset-4 hover:text-on-primary/80"
              >
                Scarica il PDF
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
