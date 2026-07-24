"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PanelLeft } from "lucide-react";
import { listPractices, PracticeStorageNotConfiguredError, updatePracticeStatus } from "@/lib/practices/api";
import { PRACTICE_STATUSES, type DocumentCategory, type Practice } from "@/lib/practices/types";
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
  const [pendingSwitch, setPendingSwitch] = useState<(() => void) | null>(null);
  const [leaveStatusChoice, setLeaveStatusChoice] = useState("");
  const router = useRouter();

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

  /**
   * Any navigation that would leave a currently open practice (selecting
   * another one, creating a new one, opening a cross-section result)
   * first asks the notary what status to leave it in — with an explicit
   * option to skip saving and move on anyway.
   */
  function requestSwitch(action: () => void) {
    if (!selected) {
      action();
      return;
    }
    setLeaveStatusChoice(selected.status);
    setPendingSwitch(() => action);
  }

  async function handleConfirmLeaveWithSave() {
    if (selected) {
      const { practice: updated } = await updatePracticeStatus(selected.practice_id, leaveStatusChoice);
      handlePracticeUpdated(updated);
    }
    const action = pendingSwitch;
    setPendingSwitch(null);
    action?.();
  }

  function handleConfirmLeaveWithoutSave() {
    const action = pendingSwitch;
    setPendingSwitch(null);
    action?.();
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

  // Ask what status to leave the practice in when the notary clicks any
  // internal link (e.g. the site's left nav) away from this page, not
  // just when switching practices inside this component.
  useEffect(() => {
    if (!selected) return;

    function handleClickCapture(e: MouseEvent) {
      const link = (e.target as HTMLElement)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("/") || href === window.location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      requestSwitch(() => router.push(href));
    }

    document.addEventListener("click", handleClickCapture, true);
    return () => document.removeEventListener("click", handleClickCapture, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selected]);

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
                requestSwitch(() => {
                  setSelectedId(id);
                  setSidebarOpen(false);
                });
              }}
              onNew={() => {
                requestSwitch(() => {
                  setShowNewModal(true);
                  setSidebarOpen(false);
                });
              }}
              onTrashed={handleTrashed}
              onRestored={refetchPractices}
              onFoundPractice={(practice) => requestSwitch(() => handleFoundPractice(practice))}
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
                requestSwitch(() => {
                  setSelectedId(id);
                  setMobileView("chat");
                });
              }}
              onNew={() => requestSwitch(() => setShowNewModal(true))}
              onTrashed={handleTrashed}
              onRestored={refetchPractices}
              onFoundPractice={(practice) => requestSwitch(() => handleFoundPractice(practice))}
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
            <PracticeWorkspace
              practice={selected}
              onOpenVisuraPortal={handleOpenVisuraPortal}
              onPracticeUpdated={handlePracticeUpdated}
            />
            <DocumentsPanel
              practiceId={selected.practice_id}
              practiceType={selected.practice_type}
              collapsed={docsCollapsed}
              onToggleCollapsed={() => setDocsCollapsed((v) => !v)}
              pendingVisuraCategory={pendingVisuraCategory}
              onClearPendingVisura={() => setPendingVisuraCategory(null)}
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

      {pendingSwitch && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-background p-5 shadow-2xl">
            <h3 className="font-serif text-base font-semibold text-foreground">
              Stai lasciando «{selected.title}»
            </h3>
            <p className="mt-1 text-xs text-secondary">In che stato vuoi lasciare questa pratica?</p>
            <select
              value={leaveStatusChoice}
              onChange={(e) => setLeaveStatusChoice(e.target.value)}
              className="mt-3 w-full rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
            >
              {PRACTICE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConfirmLeaveWithSave}
                className="w-full rounded-full bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Salva stato e continua
              </button>
              <button
                type="button"
                onClick={handleConfirmLeaveWithoutSave}
                className="w-full rounded-full border py-2 text-sm font-medium text-secondary hover:bg-muted hover:text-foreground"
              >
                Non salvare
              </button>
              <button
                type="button"
                onClick={() => setPendingSwitch(null)}
                className="w-full py-1 text-xs text-secondary hover:text-foreground"
              >
                Annulla, resta qui
              </button>
            </div>
          </div>
        </div>
      )}

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
