const { ImapFlow } = require("imapflow");
const { simpleParser } = require("mailparser");

/**
 * Reads env-configured IMAP credentials for the notary's own webmail —
 * server-only, never exposed to the client. Returns null when not
 * configured yet, same "not configured" pattern used for Supabase.
 */
function getImapConfig() {
  const host = process.env.WEBMAIL_IMAP_HOST;
  const port = process.env.WEBMAIL_IMAP_PORT;
  const user = process.env.WEBMAIL_IMAP_USER;
  const pass = process.env.WEBMAIL_IMAP_PASSWORD;
  if (!host || !port || !user || !pass) return null;
  return {
    host,
    port: Number(port),
    secure: process.env.WEBMAIL_IMAP_TLS !== "false",
    auth: { user, pass },
  };
}

/**
 * Fetches the most recent messages from INBOX (read-only) and parses
 * sender/subject/date/body/attachments. Attachments are base64-encoded
 * so the client can preview and, on confirmation, upload them into a
 * practice via the existing document-upload endpoint.
 */
async function fetchRecentEmails(limit = 20) {
  const config = getImapConfig();
  if (!config) return null;

  const client = new ImapFlow({ ...config, logger: false });
  await client.connect();
  const emails = [];

  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const status = await client.status("INBOX", { messages: true });
      const total = status.messages || 0;
      if (total === 0) return [];

      const start = Math.max(1, total - limit + 1);
      for await (const message of client.fetch(`${start}:${total}`, { source: true, envelope: true, uid: true })) {
        const parsed = await simpleParser(message.source);
        emails.push({
          uid: message.uid,
          from: parsed.from?.text || "",
          subject: parsed.subject || "(senza oggetto)",
          date: parsed.date ? parsed.date.toISOString() : null,
          snippet: (parsed.text || "").slice(0, 500),
          attachments: (parsed.attachments || []).map((att, i) => ({
            index: i,
            filename: att.filename || `allegato-${i + 1}`,
            mimeType: att.contentType || "application/octet-stream",
            dataBase64: att.content.toString("base64"),
          })),
        });
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }

  return emails.reverse();
}

module.exports = { getImapConfig, fetchRecentEmails };
