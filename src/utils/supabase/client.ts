import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// สร้าง Supabase client instance
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

const a = supabase.auth.getSession();