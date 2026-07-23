"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nome = String(formData.get("nome") ?? "");
    const email = String(formData.get("email") ?? "");
    const messaggio = String(formData.get("messaggio") ?? "");

    const subject = encodeURIComponent(`Richiesta di consulenza da ${nome}`);
    const body = encodeURIComponent(`${messaggio}\n\n— ${nome} (${email})`);

    window.location.href = `mailto:aurora.dimaio@unisalento.it?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor="nome"
          className="block text-sm font-medium text-primary"
        >
          Nome e cognome <span aria-hidden="true">*</span>
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          autoComplete="name"
          className="mt-2 block w-full rounded-md border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-primary"
        >
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 block w-full rounded-md border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label
          htmlFor="messaggio"
          className="block text-sm font-medium text-primary"
        >
          Messaggio <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          required
          rows={5}
          className="mt-2 block w-full rounded-md border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <p className="mt-2 text-xs text-secondary">
          Descrivi brevemente la tua pratica: il messaggio verrà preparato nel
          tuo client di posta.
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-accent/90 sm:w-auto"
      >
        Invia richiesta
      </button>

      <p aria-live="polite" className="text-sm text-secondary">
        {sent &&
          "Il tuo client di posta si sta aprendo con il messaggio precompilato."}
      </p>
    </form>
  );
}
