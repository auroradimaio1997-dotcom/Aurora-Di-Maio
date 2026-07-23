import type { LucideIcon } from "lucide-react";

export default function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-6 transition-shadow duration-200 hover:shadow-md">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-serif text-lg font-semibold text-primary">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-secondary">
        {description}
      </p>
    </div>
  );
}
