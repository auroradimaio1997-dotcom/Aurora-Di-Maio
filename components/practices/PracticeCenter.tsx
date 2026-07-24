"use client";

import { useEffect, useState } from "react";
import { PanelLeft } from "lucide-react";
import { listPractices, PracticeStorageNotConfiguredError } from "@/lib/practices/api";
import type { DocumentCategory, Practice } from "@/lib/practices/types";
import NewPracticeModal from "./NewPracticeModal";
import PracticeSidebar from "./PracticeSidebar";
import PracticeWorkspace from "./PracticeWorkspace";
import DocumentsPanel from "./DocumentsPanel";

/**
 * Entry point for the practice system, mounted inside a specialist page
 * (e.g. Assistente Notarile → Redazione Atti → Inter vivos). practiceType/
 * area/agentId identify which specialist agent new practices here get
 * assigned to.
 *
 * The practice list is a drawer, closed by default, so the working page
 * stays full-width and clean — it only appears when explicitly opened.
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
  const [foreignPractices, setForeignPractices] = useState<Practice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [mobileView, setMobileView] = useState<"practices" | "chat" | "documents">("chat");
  const [docsCollapsed, setDocsCollapsed] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingVisuraCategory, setPendingVisuraCategory] = useState<DocumentCategory | null>(null);

  function handleOpenVisuraPortal(category: DocumentCategory) {
    setPendingVisuraCategory(category);
    setDocsCollapsed(false);
    setMobileView("documents");
  }

  function refetchPractices() {
    listPractices({ practiceType })
      .then(({ practices }) => setPractices(practices))
      .catch((err) => {
        if (err instanceof PracticeStorageNotConfiguredError) setNotConfigured(true);
      });
  }

  useEffect(() => {
    refetchPractices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceType]);

  function handleTrashed(practiceId: string) {
    setPractices((prev) => prev.filter((p) => p.practice_id !== practiceId));
    setForeignPractices((prev) => prev.filter((p) => p.practice_id !== practiceId));
    if (selectedId === practiceId) setSelectedId(null);
  }

  function handleFoundPractice(practice: Practice) {
    setForeignPractices((prev) =>
      prev.some((p) => p.practice_id === practice.practice_id) ? prev : [practice, ...prev]
    );
    setSelectedId(practice.practice_id);
  }

  function handlePracticeUpdated(updated: Practice) {
    setPractices((prev) =>
      prev.some((p) => p.practice_id === updated.practice_id)
        ? prev.map((p) => (p.practice_id === updated.practice_id ? updated : p))
        : prev
    );
    setForeignPractices((prev) =>
      prev.some((p) => p.practice_id === updated.practice_id)
        ? prev.map((p) => (p.practice_id === updated.practice_id ? updated : p))
        : prev
    );
  }

  const selected =
    practices.find((p) => p.practice_id === selectedId) ??
    foreignPractices.find((p) => p.practice_id === selectedId) ??
    null;

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
    <div className="relative flex h-full overflow-hidden">
      {/* Desktop + iPad: sidebar as an overlay drawer, closed by default */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="absolute left-3 top-3 z-30 hidden items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-secondary shadow-sm hover:text-foreground md:flex"
      >
        <PanelLeft size={14} aria-hidden="true" />
        Pratiche
      </button>

      {sidebarOpen && (
        <div className="absolute inset-0 z-40 hidden md:block">
          <div
            className="absolute inset-0 bg-navy/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r bg-background p-3 shadow-2xl">
            <PracticeSidebar
              practices={practices}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setSidebarOpen(false);
              }}
              onNew={() => {
                setShowNewModal(true);
                setSidebarOpen(false);
              }}
              onTrashed={handleTrashed}
              onRestored={refetchPractices}
              onFoundPractice={handleFoundPractice}
            />
          </div>
        </div>
      )}

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
              onTrashed={handleTrashed}
              onRestored={refetchPractices}
              onFoundPractice={handleFoundPractice}
            />
          </div>
        )}
        {mobileView === "chat" &&
          (selected ? (
            <PracticeWorkspace
              practice={selected}
              onOpenVisuraPortal={handleOpenVisuraPortal}
              onPracticeUpdated={handlePracticeUpdated}
            />
          ) : (
            <p className="p-4 text-sm text-secondary">Seleziona o crea una pratica.</p>
          ))}
        {mobileView === "documents" &&
          (selected ? (
            <DocumentsPanel
              practiceId={selected.practice_id}
              practiceType={selected.practice_type}
              collapsed={false}
              onToggleCollapsed={() => {}}
              pendingVisuraCategory={pendingVisuraCategory}
              onClearPendingVisura={() => setPendingVisuraCategory(null)}
            />
          ) : (
            <p className="p-4 text-sm text-secondary">Seleziona una pratica.</p>
          ))}
      </div>

      {/* Desktop + iPad: full-width chat + documents panel, sidebar is the drawer above */}
      <div className="hidden flex-1 md:flex">
        {selected ? (
          <>
            <DocumentsPanel
              practiceId={selected.practice_id}
              practiceType={selected.practice_type}
              collapsed={docsCollapsed}
              onToggleCollapsed={() => setDocsCollapsed((v) => !v)}
              pendingVisuraCategory={pendingVisuraCategory}
              onClearPendingVisura={() => setPendingVisuraCategory(null)}
            />
            <PracticeWorkspace
              practice={selected}
              onOpenVisuraPortal={handleOpenVisuraPortal}
              onPracticeUpdated={handlePracticeUpdated}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="mb-3 text-sm text-secondary">Seleziona o crea una pratica per iniziare.</p>
              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Nuova pratica
              </button>
            </div>
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
