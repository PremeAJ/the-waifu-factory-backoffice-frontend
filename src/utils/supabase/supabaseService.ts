import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// สร้าง Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ฟังก์ชันสำหรับ sign in ด้วย email/password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// ฟังก์ชันสำหรับ sign up ด้วย email/password
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

// ฟังก์ชันสำหรับ sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// ฟังก์ชันสำหรับดึง session ปัจจุบัน
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}