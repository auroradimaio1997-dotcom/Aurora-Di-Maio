import { Bot, Sparkles } from "lucide-react";

/**
 * Reserved section for the future AI agent(s) (chat assistant, practice
 * automation, etc.). Swap the placeholder content below for the real
 * integration once the agent and its interface contract are defined.
 */
export default function AssistantSlot() {
  return (
    <section
      aria-labelledby="assistant-heading"
      className="border-y bg-primary"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-on-primary/10 text-on-primary">
            <Bot size={24} aria-hidden="true" />
          </span>
          <div>
            <h2
              id="assistant-heading"
              className="font-serif text-2xl font-semibold text-on-primary"
            >
              Assistente virtuale, in arrivo
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-on-primary/70">
              Questo spazio è riservato a un assistente AI dedicato allo
              studio: risposte immediate su pratiche notarili, orientamento
              sui documenti necessari e supporto alla ricerca. Presto
              disponibile.
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
