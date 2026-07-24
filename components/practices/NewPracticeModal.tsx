"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createPractice, PracticeStorageNotConfiguredError } from "@/lib/practices/api";
import type { Practice } from "@/lib/practices/types";

export default function NewPracticeModal({
  practiceType,
  area,
  agentId,
  onClose,
  onCreated,
}: {
  practiceType: string;
  area: string;
  agentId: string;
  onClose: () => void;
  onCreated: (practice: Practice) => void;
}) {
  const [title, setTitle] = useState("");
  const [parties, setParties] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "not-configured">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setStatus("saving");
    try {
      const { practice } = await createPractice({
        title: title.trim(),
        practiceType,
        area,
        agentId,
        parties: parties.trim() || undefined,
        description: description.trim() || undefined,
      });
      onCreated(practice);
    } catch (err) {
      if (err instanceof PracticeStorageNotConfiguredError) {
        setStatus("not-configured");
      } else {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Errore imprevisto.");
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-foreground">Nuova pratica</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-secondary hover:bg-muted hover:text-foreground"
            aria-label="Chiudi"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-secondary">
              Nome della pratica
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. Compravendita Rossi – Bianchi"
              required
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-secondary">
            <div>
              <span className="mb-1 block font-medium">Tipo</span>
              <p className="rounded-lg border bg-muted px-3 py-2 text-foreground">{practiceType}</p>
            </div>
            <div>
              <span className="mb-1 block font-medium">Agente</span>
              <p className="rounded-lg border bg-muted px-3 py-2 text-foreground">{agentId}</p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-secondary">
              Parti o società interessate (facoltativo)
            </label>
            <input
              type="text"
              value={parties}
              onChange={(e) => setParties(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-secondary">
              Descrizione breve (facoltativo)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {status === "not-configured" && (
            <p className="rounded-lg bg-muted px-3 py-2 text-xs text-secondary">
              Archiviazione permanente in preparazione — il database non è ancora
              collegato sul server.
            </p>
          )}
          {status === "error" && <p className="text-xs text-destructive">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === "saving" || !title.trim()}
            className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "saving" ? "Creazione…" : "Crea pratica"}
          </button>
        </form>
      </div>
    </div>
  );
}
