"use client";

import { useEffect, useState } from "react";
import { listPractices, PracticeStorageNotConfiguredError } from "@/lib/practices/api";
import type { Practice } from "@/lib/practices/types";
import NewPracticeModal from "./NewPracticeModal";
import PracticeSidebar from "./PracticeSidebar";
import PracticeWorkspace from "./PracticeWorkspace";
import DocumentsPanel from "./DocumentsPanel";

/**
 * Entry point for the practice system, mounted inside a specialist page
 * (e.g. Assistente Notarile → Redazione Atti → Inter vivos). practiceType/
 * area/agentId identify which specialist agent new practices here get
 * assigned to.
 */
export default function PracticeCenter({
  practiceType,
  area,
  agentId,
}: {
  practiceType: string;
  area: string;
  agentId: string;
}) {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [mobileView, setMobileView] = useState<"practices" | "chat" | "documents">("chat");
  const [docsCollapsed, setDocsCollapsed] = useState(false);

  useEffect(() => {
    listPractices()
      .then(({ practices }) => setPractices(practices))
      .catch((err) => {
        if (err instanceof PracticeStorageNotConfiguredError) setNotConfigured(true);
      });
  }, []);

  const selected = practices.find((p) => p.practice_id === selectedId) ?? null;

  if (notConfigured) {
    return (
      <div className="rounded-xl border bg-muted p-6 text-center">
        <p className="text-sm text-secondary">
          Archiviazione permanente in preparazione — il database non è ancora
          collegato sul server. Configura <code>SUPABASE_URL</code> e{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> per attivare il sistema di
          pratiche.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-160px)] min-h-[540px] overflow-hidden rounded-xl border">
      {/* Desktop + iPad sidebar */}
      <div className="hidden w-64 shrink-0 border-r bg-background p-3 md:block">
        <PracticeSidebar
          practices={practices}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onNew={() => setShowNewModal(true)}
        />
      </div>

      {/* Mobile: tab bar to switch areas, one visible at a time */}
      <div className="flex flex-1 flex-col md:hidden">
        <div className="flex border-b text-xs">
          {(["practices", "chat", "documents"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileView(tab)}
              className={`flex-1 py-2 font-medium ${
                mobileView === tab ? "border-b-2 border-blue-600 text-foreground" : "text-secondary"
              }`}
            >
              {tab === "practices" ? "Pratiche" : tab === "chat" ? "Chat" : "Documenti"}
            </button>
          ))}
        </div>

        {mobileView === "practices" && (
          <div className="flex-1 overflow-y-auto p-3">
            <PracticeSidebar
              practices={practices}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setMobileView("chat");
              }}
              onNew={() => setShowNewModal(true)}
            />
          </div>
        )}
        {mobileView === "chat" &&
          (selected ? (
            <PracticeWorkspace practice={selected} />
          ) : (
            <p className="p-4 text-sm text-secondary">Seleziona o crea una pratica.</p>
          ))}
        {mobileView === "documents" &&
          (selected ? (
            <DocumentsPanel
              practiceId={selected.practice_id}
              collapsed={false}
              onToggleCollapsed={() => {}}
            />
          ) : (
            <p className="p-4 text-sm text-secondary">Seleziona una pratica.</p>
          ))}
      </div>

      {/* Desktop + iPad: chat + documents panel */}
      <div className="hidden flex-1 md:flex">
        {selected ? (
          <>
            <PracticeWorkspace practice={selected} />
            <DocumentsPanel
              practiceId={selected.practice_id}
              collapsed={docsCollapsed}
              onToggleCollapsed={() => setDocsCollapsed((v) => !v)}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-secondary">Seleziona o crea una pratica per iniziare.</p>
          </div>
        )}
      </div>

      {showNewModal && (
        <NewPracticeModal
          practiceType={practiceType}
          area={area}
          agentId={agentId}
          onClose={() => setShowNewModal(false)}
          onCreated={(practice) => {
            setPractices((prev) => [practice, ...prev]);
            setSelectedId(practice.practice_id);
            setShowNewModal(false);
          }}
        />
      )}
    </div>
  );
}
