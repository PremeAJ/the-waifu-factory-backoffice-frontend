import { AuthOptions } from "next-auth";
import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import { headers as nextHeaders } from "next/headers";
import { HeadersKey } from "../constants/header";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

async function header(accessToken?: string) {
  const reqHeaders = await nextHeaders();
  const ua = reqHeaders.get("user-agent") || "";
  const origin = reqHeaders.get("origin") || process.env.NEXTAUTH_URL || "";
  const coolies = reqHeaders.get("cookie") || "";

  return {
    [HeadersKey.UserAgent]: ua,
    [HeadersKey.Origin]: origin,
    [HeadersKey.Authorization]: accessToken ? `Bearer ${accessToken}` : "",
    [HeadersKey.Cookies]: coolies,
  };
}

function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "CaptchaToken", type: "text" },
        rememberMe: { label: "rememberMe", type: "boolean" },
      },
      async authorize(credentials) {
        const { email, password, rememberMe } = credentials || {};
        const login = await postFetcher(
          `${baseUrl}/api/v1/auth/login`,
          { email, password, rememberMe: rememberMe === "true" },
          { ...(await header()) }
        );
        if (login.statusCode !== 200) throw new Error(login.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");

        const { accessToken } = login.data;
        const profile = await getFetcher(`${baseUrl}/api/v1/profile`, { ...(await header(accessToken)) });
        console.log("🚀 ~ authorize ~ profile:", profile)
        if (profile.statusCode !== 200) throw new Error(profile.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return { ...login.data, profile: profile.data };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, session, account }) {
      if (account?.provider === "google" && user) {
        const login = await postFetcher(`${baseUrl}/api/v1/auth/login-google`, { id_token: account.id_token }, { ...(await header()) });
        if (login.statusCode !== 200) throw new Error(login.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        const { accessToken } = login.data;
        const profile = await getFetcher(`${baseUrl}/api/v1/profile`, { ...(await header(accessToken)) });
        if (profile.statusCode !== 200) throw new Error(profile.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return { ...login.data, profile: profile.data };
      }
      if (user) {
        if (user.accessToken) token.accessToken = user.accessToken;
        if (user.refreshToken) token.refreshToken = user.refreshToken;
        if (user.profile) token.profile = user.profile;
      }
      if (session) {
        if (session.profile) token.profile = session.profile;
      }
      if (token.accessToken && isExpired(token.accessToken)) {
        const refreshed = await postFetcher(
          `${baseUrl}/api/v1/session/refresh`,
          { token: token.refreshToken },
          { ...(await header(token.accessToken)) }
        );
        if (refreshed?.error) {
          throw new Error(refreshed.message);
        }
        if (refreshed.data.accessToken && refreshed.data.refreshToken) {
          token.refreshToken = refreshed.data.refreshToken;
          token.accessToken = refreshed.data.accessToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      delete session.user;
      if (token) {
        if (token.accessToken) session.accessToken = token.accessToken;
        if (token.refreshToken) session.refreshToken = token.refreshToken;
        if (token.profile) session.profile = token.profile;
      }
      return session;
    },
  },
};

export default authOptions;
