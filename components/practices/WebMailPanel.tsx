"use client";

import { useState } from "react";
import { Check, Loader2, Mail, Paperclip, RefreshCw } from "lucide-react";
import { listPractices, postMessage, uploadDocument } from "@/lib/practices/api";
import type { Practice } from "@/lib/practices/types";

type EmailAttachment = {
  index: number;
  filename: string;
  mimeType: string;
  dataBase64: string;
};

type Email = {
  uid: number;
  from: string;
  subject: string;
  date: string | null;
  snippet: string;
  attachments: EmailAttachment[];
};

function suggestPractice(email: Email, practices: Practice[]): Practice | null {
  const haystack = `${email.subject} ${email.snippet}`.toLowerCase();
  return practices.find((p) => haystack.includes(p.title.toLowerCase())) ?? null;
}

function EmailCard({ email, practices }: { email: Email; practices: Practice[] }) {
  const suggested = suggestPractice(email, practices);
  const [selectedId, setSelectedId] = useState(suggested?.practice_id ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleConfirm() {
    const practice = practices.find((p) => p.practice_id === selectedId);
    if (!practice) return;
    setStatus("saving");
    try {
      await postMessage(practice.practice_id, {
        role: "user",
        text: `Email ricevuta da ${email.from}: "${email.subject}"${
          email.attachments.length > 0 ? ` — ${email.attachments.length} allegato/i` : ""
        }`,
      });
      for (const att of email.attachments) {
        await uploadDocument(practice.practice_id, {
          name: att.filename,
          category: "Allegati",
          mimeType: att.mimeType,
          dataBase64: att.dataBase64,
        });
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-lg border p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{email.subject}</p>
          <p className="truncate text-xs text-secondary">
            {email.from}
            {email.date && ` · ${new Date(email.date).toLocaleString("it-IT")}`}
          </p>
        </div>
        {email.attachments.length > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-secondary">
            <Paperclip size={12} aria-hidden="true" />
            {email.attachments.length}
          </span>
        )}
      </div>

      {email.snippet && <p className="mt-2 line-clamp-3 text-xs text-secondary">{email.snippet}</p>}

      {email.attachments.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-secondary">
          {email.attachments.map((att) => (
            <li key={att.index} className="truncate">
              {att.filename}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 text-xs text-foreground"
        >
          <option value="">Seleziona la pratica giusta…</option>
          {practices.map((p) => (
            <option key={p.practice_id} value={p.practice_id}>
              {p.title} · {p.practice_type}
              {suggested?.practice_id === p.practice_id ? " (suggerita)" : ""}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedId || status === "saving" || status === "done"}
          className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "saving" ? (
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          ) : status === "done" ? (
            <Check size={13} aria-hidden="true" />
          ) : null}
          {status === "done" ? "Caricato" : "Conferma e carica nella pratica"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-1 text-xs text-destructive">Errore nel caricamento. Riprova.</p>
      )}
    </div>
  );
}

/**
 * Reads the notary's own mailbox (read-only, via IMAP) and lets them
 * confirm which practice each email — and its attachments — belongs to
 * before anything is filed. Nothing gets uploaded without that explicit
 * confirmation.
 */
export default function WebMailPanel() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "not-configured" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCheck() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const [emailsRes, practicesRes] = await Promise.all([
        fetch("/api/webmail/emails"),
        listPractices(),
      ]);
      if (emailsRes.status === 503) {
        setStatus("not-configured");
        return;
      }
      const data = await emailsRes.json();
      if (!emailsRes.ok) throw new Error(data.error || "Errore nel controllo della posta.");
      setEmails(data.emails);
      setPractices(practicesRes.practices);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Errore imprevisto.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
        Web Mail Notariato
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Controlla le email ricevute nella tua casella e carica i documenti allegati nella pratica
        giusta, con conferma esplicita prima di ogni archiviazione.
      </p>

      <button
        type="button"
        onClick={handleCheck}
        disabled={status === "loading"}
        className="mt-4 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw size={15} aria-hidden="true" />
        )}
        Controlla nuove email
      </button>

      {status === "not-configured" && (
        <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-sm text-secondary">
          Webmail non ancora configurata sul server — vanno impostate le variabili
          <code className="mx-1 rounded bg-background px-1">WEBMAIL_IMAP_HOST</code>,
          <code className="mx-1 rounded bg-background px-1">WEBMAIL_IMAP_PORT</code>,
          <code className="mx-1 rounded bg-background px-1">WEBMAIL_IMAP_USER</code> e
          <code className="mx-1 rounded bg-background px-1">WEBMAIL_IMAP_PASSWORD</code> su Vercel.
        </p>
      )}
      {status === "error" && <p className="mt-4 text-sm text-destructive">{errorMsg}</p>}

      {emails.length === 0 && status === "idle" && (
        <p className="mt-6 flex items-center gap-2 text-sm text-secondary">
          <Mail size={15} aria-hidden="true" />
          Nessuna email controllata ancora. Premi il pulsante sopra per iniziare.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {emails.map((email) => (
          <EmailCard key={email.uid} email={email} practices={practices} />
        ))}
      </div>
    </div>
  );
}
