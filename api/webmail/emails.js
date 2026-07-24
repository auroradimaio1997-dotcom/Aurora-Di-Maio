// Vercel serverless function — Node runtime.
//
// Env vars required (Vercel → Project → Settings → Environment Variables):
//   WEBMAIL_IMAP_HOST     - e.g. imap.notariato.it
//   WEBMAIL_IMAP_PORT     - e.g. 993
//   WEBMAIL_IMAP_USER     - the notary's own mailbox username
//   WEBMAIL_IMAP_PASSWORD - an app-specific password, never the main one
//   WEBMAIL_IMAP_TLS      - "false" to disable TLS (defaults to true)
//
// Read-only: only lists recent INBOX messages and their attachments so
// the notary can confirm which practice to file them under. Nothing is
// deleted, moved, or marked as read on the mail server.

const { fetchRecentEmails, getImapConfig } = require("../../lib/webmail/imapClient");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ error: "Metodo non consentito." });
    return;
  }

  if (!getImapConfig()) {
    res.status(503).json({ error: "Webmail non ancora configurata sul server." });
    return;
  }

  try {
    const emails = await fetchRecentEmails(20);
    res.status(200).json({ emails });
  } catch (err) {
    res.status(500).json({ error: `Errore nel collegamento alla webmail: ${err.message}` });
  }
};
