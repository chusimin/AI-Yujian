import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service_role key (bypasses RLS)
// Only use in API routes / server components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);
