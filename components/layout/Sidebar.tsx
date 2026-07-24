"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV, type NavGroup } from "@/lib/nav";

function GroupBlock({ group, pathname }: { group: NavGroup; pathname: string }) {
  const hasChildren = group.children.length > 0;
  const isActiveGroup =
    pathname === group.href || group.children.some((c) => pathname === c.href);
  const [open, setOpen] = useState(true);

  return (
    <div>
      {hasChildren ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
            isActiveGroup ? "text-gold" : "text-foreground"
          }`}
          aria-expanded={open}
        >
          <span>{group.label}</span>
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      ) : (
        <Link
          href={group.href}
          className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            pathname === group.href ? "text-gold" : "text-foreground"
          }`}
        >
          {group.label}
        </Link>
      )}

      {hasChildren && open && (
        <ul className="ml-3 space-y-0.5 border-l border-border pl-3">
          {group.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                  pathname === child.href
                    ? "text-gold"
                    : "text-secondary hover:text-foreground"
                }`}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SidebarContent() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigazione sezioni" className="space-y-8">
      {NAV.map((section) => (
        <div key={section.href}>
          <Link
            href={section.href}
            className={`block px-3 pb-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
              pathname === section.href ? "text-gold" : "text-secondary hover:text-foreground"
            }`}
          >
            {section.label}
          </Link>
          <div className="space-y-1">
            {section.groups.map((group, i) => (
              <GroupBlock key={`${group.href}-${i}`} group={group} pathname={pathname} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="mb-4 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-foreground"
          aria-label="Apri il menu di navigazione"
        >
          <Menu size={16} aria-hidden="true" />
          Menu
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 md:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-navy/80"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-background p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mb-6 flex h-9 w-9 items-center justify-center rounded-md border"
              aria-label="Chiudi il menu di navigazione"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
