"use server";
import { createServerClient } from "@supabase/ssr";
import { last } from "lodash";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function ssrSignInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function test(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstname: "john",
        lastname: "doe",
        age: 25,
      },
    },
  });
}

export async function ssrSignUpWithEmail(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function ssrSignOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}

export const ssrRefreshSession = async () => {
  const supabase = await createClient();
  return supabase.auth.getSession();
};

export const ssrGetUser = async () => {
  const supabase = await createClient();
  return supabase.auth.getUser();
};
