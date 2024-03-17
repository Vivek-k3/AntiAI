import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL = "https://hpqlrvpukunwbmuyqpfi.supabase.co";
const NEXT_PUBLIC_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwcWxydnB1a3Vud2JtdXlxcGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0NDA0NjMsImV4cCI6MjAyNjAxNjQ2M30.PwHx7g7bulRIC9o6Af_6DIp681_zG43LUy4kCXtfQ_w";

export const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_KEY
);
