"use server";
import { createServerClient } from "@supabase/ssr";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  VerifyOtpParams,
} from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";

// ---------- Types ----------
export interface ErrorLogData {
  errorCode?: string;
  ip?: string;
  endpoint?: string;
  details?: any;
}

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

// ---------- Utility Functions ----------
export async function getClientIP() {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

export async function logError(data: ErrorLogData) {
  console.error(
    JSON.stringify(
      {
        ...data,
      },
      null,
      2
    )
  );
}

async function removeCookies() {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((c) => {
    if (c.name.startsWith("sb-")) {
      cookieStore.delete(c.name);
    }
  });
}

// ---------- Supabase Client ----------
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
                secure: true,
                sameSite: "none",
                path: "/",
                maxAge: 7 * 24 * 60 * 60,
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

// ---------- Auth Functions ----------

// Sign In/Sign Up/Sign Out
export async function ssrSignInWithEmail(
  payload: SignInWithPasswordCredentials
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    await logError({
      errorCode: error.code,
      ip: await getClientIP(),
      endpoint: "signInWithPassword",
    });
  }

  return { data, error: error?.code };
}

export async function ssrSignUpWithEmail(
  payload: SignUpWithPasswordCredentials
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(payload);
  if (error) {
    await logError({
      errorCode: error.code,
      ip: await getClientIP(),
      endpoint: "signUp",
    });
  }
  return { data, error: error?.code };
}

export async function ssrSignInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: new URL(
        "/auth/callback",
        process.env.NEXT_PUBLIC_DOMAIN!
      ).toString(),
    },
  });
  if (error) {
    await logError({
      errorCode: error.code,
      ip: await getClientIP(),
      endpoint: "signInWithGoogle",
    });
  }
  return { data, error: error?.code };
}

export async function ssrSignOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}

// Session/Token Management
export async function ssrSetSession({
  access_token,
  refresh_token,
}: {
  access_token: string;
  refresh_token: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    await logError({
      errorCode: error.code,
      ip: await getClientIP(),
      endpoint: "setSession",
    });
  }

  return { data, error: error?.code };
}

export async function ssrRefreshSession() {
  const supabase = await createClient();
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    await removeCookies();
    return { data: { session: null }, error };
  }
}

export async function ssrGetSession() {
  const supabase = await createClient();
  return supabase.auth.getSession();
}

export async function ssrGetUser() {
  const supabase = await createClient();
  return supabase.auth.getUser();
}

export async function ssrExchangeCodeForSession(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    await logError({
      errorCode: error.code,
      ip: await getClientIP(),
      endpoint: "updateUser: Password",
    });
  }
  return { data, error: error?.code };
}

// Password/OTP
export async function ssrForgotPassword(payload: ResetPasswordForEmailType) {
  const supabase = await createClient();
  const redirectUrl = new URL(
    "/auth/reset-password",
    process.env.NEXT_PUBLIC_DOMAIN!
  );
  payload.options.redirectTo = redirectUrl.toString();
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    payload.email,
    payload.options
  );

  if (error) {
    await logError({
      errorCode: error.code,
      ip: await getClientIP(),
      endpoint: "resetPasswordForEmail",
    });
  }

  return { data, error: error?.code };
}

export async function ssrResetPassword(payload: ResetPasswordType) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: payload.newPassword,
  });

  if (error) {
    await logError({
      errorCode: error.code,
      ip: await getClientIP(),
      endpoint: "updateUser: Password",
    });
  }

  return { data, error: error?.code };
}

export async function ssrVerifyOtp(payload: VerifyOtpParams) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp(payload);

  if (error) {
    await logError({
      errorCode: error.code,
      ip: await getClientIP(),
      endpoint: "verifyOtp",
    });
  }

  return { data, error: error?.code };
}
