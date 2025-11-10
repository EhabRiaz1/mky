import { createClient } from '@supabase/supabase-js';

let cached = null;
function getSupabase() {
  if (cached) return cached;
  const url = "https://apkohkqyebipmzvdwxgr.supabase.co";
  const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwa29oa3F5ZWJpcG16dmR3eGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODQwNDgsImV4cCI6MjA3NDU2MDA0OH0.eEvBZRf_sFDKThtjg9PxqDiK-N4eGkhxpf3W8DNqHQs";
  cached = createClient(url, anon);
  return cached;
}

export { getSupabase as g };
