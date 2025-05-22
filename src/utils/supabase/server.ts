"use server";
import { createServerClient } from "@supabase/ssr";
import {
  GenerateRecoveryLinkParams,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";
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
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              })
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

export async function ssrSignInWithEmail(
  payload: SignInWithPasswordCredentials
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  return { data, error: error?.code };
}

export async function ssrSignUpWithEmail(
  payload: SignUpWithPasswordCredentials
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(payload);
  return { data, error: error?.code };
}

export async function ssrSignOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}

export const ssrRefreshSession = async () => {
  const supabase = await createClient();
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    await removeCookies();
    return { data: { session: null }, error };
  }
};

export const ssrGetUser = async () => {
  const supabase = await createClient();
  return supabase.auth.getUser();
};

export const ssrGetSession = async () => {
  const supabase = await createClient();
  return supabase.auth.getSession();
};

export async function ssrForgotPassword(payload: ResetPasswordForEmailType) {
  const supabase = await createClient();
  payload.options.redirectTo = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/reset-password`;
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    payload.email,
    payload.options
  );
  return { data, error: error?.code };
}

export async function ssrResetPassword(payload: ResetPasswordType) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: payload.newPassword,
  });
  console.log("🚀 ~ ssrResetPassword ~ data:", data);
  console.log("🚀 ~ ssrResetPassword ~ error:", error);
  return { data, error: error?.code };
}

export async function ssrExchangeCodeForSession(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  console.log("🚀 ~ ssrExchangeCodeForSession ~ error:", error);
  console.log("🚀 ~ ssrExchangeCodeForSession ~ data:", data);
  return { data, error: error?.code };
}

const removeCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((c) => {
    if (c.name.startsWith("sb-")) {
      cookieStore.delete(c.name);
    }
  });
};

export interface ResetPasswordForEmailType {
  email: string;
  options: {
    redirectTo?: string;
    captchaToken?: string;
  };
}

export interface ResetPasswordType {
  newPassword: string;
}
