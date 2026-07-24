"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import type { Practice, PracticeStatus } from "@/lib/practices/types";
import { PRACTICE_STATUSES } from "@/lib/practices/types";

export default function PracticeSidebar({
  practices,
  selectedId,
  onSelect,
  onNew,
}: {
  practices: Practice[];
  selectedId: string | null;
  onSelect: (practiceId: string) => void;
  onNew: () => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PracticeStatus | "">("");

  const filtered = useMemo(() => {
    return practices.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [practices, query, statusFilter]);

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
          <button
            key={p.practice_id}
            type="button"
            onClick={() => onSelect(p.practice_id)}
            className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
              selectedId === p.practice_id ? "bg-muted" : "hover:bg-muted/60"
            }`}
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
