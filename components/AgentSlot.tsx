import { Bot, Sparkles } from "lucide-react";

/**
 * Reserved section for a future per-area AI agent. Swap the placeholder
 * content below for the real integration once each agent is built.
 */
export default function AgentSlot({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section aria-labelledby="agent-heading" className="rounded-xl bg-primary">
      <div className="flex flex-col items-start gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-on-primary/10 text-on-primary">
            <Bot size={24} aria-hidden="true" />
          </span>
          <div>
            <h2
              id="agent-heading"
              className="font-serif text-2xl font-semibold text-on-primary"
            >
              {title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-on-primary/70">
              {description}
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-on-primary/20 px-4 py-2 text-xs font-medium text-on-primary/80">
          <Sparkles size={14} aria-hidden="true" className="animate-pulse" />
          Prossimamente
        </span>
      </div>
    </section>
  );
}
