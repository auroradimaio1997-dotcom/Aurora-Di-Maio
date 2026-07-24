"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderSearch, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import type { Practice, PracticeStatus } from "@/lib/practices/types";
import { PRACTICE_STATUSES } from "@/lib/practices/types";
import { deletePracticeForever, listPractices, restorePractice, trashPractice } from "@/lib/practices/api";

const TRASH_RETENTION_DAYS = 7;

function daysRemaining(deletedAt: string) {
  const deletedTime = new Date(deletedAt).getTime();
  const expiresAt = deletedTime + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));
}

function TrashView({ onRestored }: { onRestored: () => void }) {
  const [trashed, setTrashed] = useState<Practice[]>([]);

  useEffect(() => {
    listPractices({ trashed: true })
      .then(({ practices }) => setTrashed(practices))
      .catch(() => {});
  }, []);

  async function handleRestore(practiceId: string) {
    await restorePractice(practiceId);
    setTrashed((prev) => prev.filter((p) => p.practice_id !== practiceId));
    onRestored();
  }

  async function handleDeleteForever(practice: Practice) {
    if (
      !window.confirm(
        `Eliminare definitivamente "${practice.title}"? Non sarà più recuperabile.`
      )
    )
      return;
    await deletePracticeForever(practice.practice_id);
    setTrashed((prev) => prev.filter((p) => p.practice_id !== practice.practice_id));
  }

  return (
    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
      {trashed.length === 0 && (
        <p className="px-1 text-xs text-secondary">Il cestino è vuoto.</p>
      )}
      {trashed.map((p) => (
        <div key={p.practice_id} className="rounded-lg border px-3 py-2">
          <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
          <p className="mt-0.5 text-xs text-secondary">
            {p.deleted_at ? `Eliminata definitivamente tra ${daysRemaining(p.deleted_at)} giorni` : ""}
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleRestore(p.practice_id)}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-secondary hover:bg-muted hover:text-foreground"
            >
              <RotateCcw size={12} aria-hidden="true" />
              Ripristina
            </button>
            <button
              type="button"
              onClick={() => handleDeleteForever(p)}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-secondary hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 size={12} aria-hidden="true" />
              Elimina ora
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FindView({ onFound }: { onFound: (practice: Practice) => void }) {
  const [all, setAll] = useState<Practice[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    listPractices()
      .then(({ practices }) => setAll(practices))
      .catch(() => {});
  }, []);

  const filtered = all.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative mb-2">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca in tutte le sezioni…"
          autoFocus
          className="w-full rounded-full border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="px-1 text-xs text-secondary">Nessuna pratica trovata.</p>
        )}
        {filtered.map((p) => (
          <button
            key={p.practice_id}
            type="button"
            onClick={() => onFound(p)}
            className="w-full rounded-lg px-2 py-2 text-left hover:bg-muted/60"
          >
            <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
            <p className="mt-0.5 truncate text-xs text-secondary">
              {p.practice_type} · {p.status}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PracticeSidebar({
  practices,
  selectedId,
  onSelect,
  onNew,
  onTrashed,
  onRestored,
  onFoundPractice,
}: {
  practices: Practice[];
  selectedId: string | null;
  onSelect: (practiceId: string) => void;
  onNew: () => void;
  onTrashed: (practiceId: string) => void;
  onRestored: () => void;
  onFoundPractice: (practice: Practice) => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PracticeStatus | "">("");
  const [view, setView] = useState<"active" | "trash" | "find">("active");
  const [trashRefreshKey, setTrashRefreshKey] = useState(0);

  const filtered = useMemo(() => {
    return practices.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [practices, query, statusFilter]);

  async function handleTrash(p: Practice) {
    if (!window.confirm(`Eliminare "${p.title}"? Resterà nel cestino per 7 giorni.`)) return;
    await trashPractice(p.practice_id);
    onTrashed(p.practice_id);
  }

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={onNew}
        className="mb-3 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <Plus size={15} aria-hidden="true" />
        Nuova pratica
      </button>

      {view === "active" ? (
        <>
          <div className="relative mb-2">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca pratica…"
              className="w-full rounded-full border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PracticeStatus | "")}
            className="mb-3 rounded-lg border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Tutti gli stati</option>
            {PRACTICE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-1 text-xs text-secondary">Nessuna pratica trovata.</p>
            )}
            {filtered.map((p) => (
              <div
                key={p.practice_id}
                className={`group flex items-center gap-1 rounded-lg px-1 ${
                  selectedId === p.practice_id ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(p.practice_id)}
                  className="min-w-0 flex-1 truncate py-2 pl-2 text-left"
                >
                  <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                  <p className="mt-0.5 truncate text-xs text-secondary">
                    {p.practice_type} · {p.status}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleTrash(p)}
                  className="shrink-0 rounded-md p-1.5 text-secondary opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label="Elimina pratica"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setView("find")}
              className="flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-secondary hover:bg-muted hover:text-foreground"
            >
              <FolderSearch size={12} aria-hidden="true" />
              Trova pratiche
            </button>
            <button
              type="button"
              onClick={() => {
                setView("trash");
                setTrashRefreshKey((k) => k + 1);
              }}
              className="flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-secondary hover:bg-muted hover:text-foreground"
            >
              <Trash2 size={12} aria-hidden="true" />
              Cestino
            </button>
          </div>
        </>
      ) : view === "trash" ? (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary">Cestino (7 giorni)</span>
            <button
              type="button"
              onClick={() => setView("active")}
              className="rounded-full p-1 text-secondary hover:bg-muted hover:text-foreground"
              aria-label="Torna alle pratiche"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <TrashView
            key={trashRefreshKey}
            onRestored={() => {
              setTrashRefreshKey((k) => k + 1);
              onRestored();
            }}
          />
        </>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary">
              Trova pratiche (tutte le sezioni)
            </span>
            <button
              type="button"
              onClick={() => setView("active")}
              className="rounded-full p-1 text-secondary hover:bg-muted hover:text-foreground"
              aria-label="Torna alle pratiche"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <FindView
            onFound={(p) => {
              onFoundPractice(p);
              setView("active");
            }}
          />
        </>
      )}
    </div>
  );
}
