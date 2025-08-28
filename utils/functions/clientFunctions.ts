import { createClient } from "../supabase/client";

// Fetch reports (public-safe via RLS)
export async function fetchReportsClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("fetch_reports");
  if (error) throw error;
  return data;
}