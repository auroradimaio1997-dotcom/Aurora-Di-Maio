import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Shared placeholder for every leaf/group/section page in the new
 * architecture. Layout + routing only, per brief — no real content or
 * agent logic here yet.
 */
export default function PagePlaceholder({
  title,
  breadcrumbs = [],
  description,
  children: childLinks,
}: {
  title: string;
  breadcrumbs?: Crumb[];
  description?: string;
  children?: { label: string; href: string }[];
}) {
  return (
    <div>
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-secondary">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
        {title}
      </h1>

      <p className="mt-3 max-w-xl text-secondary">
        {description ?? "Contenuto in arrivo — questa sezione è al momento un placeholder."}
      </p>

      {childLinks && childLinks.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {childLinks.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="group rounded-xl border bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
            >
              <span className="font-serif text-lg font-semibold text-foreground group-hover:text-foreground">
                {child.label}
              </span>
              <p className="mt-1 text-sm text-secondary">Contenuto in arrivo.</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
