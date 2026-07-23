import Sidebar from "./Sidebar";

/**
 * Persistent two-column shell (sidebar + content) used by the chat home
 * (once entered) and every nested section page. Kept as a component each
 * page opts into, rather than a Next.js layout.tsx, so the cinematic intro
 * on "/" can render full-bleed without the sidebar before the visitor
 * enters.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10 md:py-14">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
