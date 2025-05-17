"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

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

export async function ssrSignInWithEmail(payload: signInPayload) {
  try {
    const supabase = await createClient();
    return await supabase.auth.signInWithPassword(payload);
  } catch (error: any) {
    // ส่ง error object กลับ client
    return { error: { message: error.message || "Unknown error" } };
  }
}

// export async function test(email: string, password: string) {
//   const supabase = await createClient();
//   return supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         firstname: "john",
//         lastname: "doe",
//         age: 25,
//       },
//     },
//   });
// }

export async function ssrSignUpWithEmail(payload: signInPayload) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword(payload);
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

const removeCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((c) => {
    if (c.name.startsWith("sb-")) {
      cookieStore.delete(c.name);
    }
  });
};

export type signInPayload = {
  email: string;
  password: string;
};
