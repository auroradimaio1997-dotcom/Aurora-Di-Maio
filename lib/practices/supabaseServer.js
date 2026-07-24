const { createClient } = require("@supabase/supabase-js");

// Server-only. SUPABASE_SERVICE_ROLE_KEY must never reach the client —
// it bypasses Row Level Security by design, which is fine here because
// only our own serverless functions (never the browser) ever hold it.
function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

module.exports = { getSupabaseServerClient };
