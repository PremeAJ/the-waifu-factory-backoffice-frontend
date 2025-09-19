import { AuthOptions } from "next-auth";
import { cookies, headers as nextHeaders } from "next/headers";
import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import { getHeaders } from "../utils/getHeaders";
import { HeadersKey } from "../constants/header";
import { v4 as uuidv4 } from "uuid";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

async function header(accessToken?: string) {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get(HeadersKey.DeviceId)?.value;
  if (!deviceId) {
    deviceId = uuidv4();
    cookieStore.set(HeadersKey.DeviceId, deviceId, { expires: 3560, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  }
  const language = cookieStore.get(HeadersKey.Lang)?.value || "th";
  const userAgent = cookieStore.get(HeadersKey.UserAgent)?.value || "";
  const latitude = cookieStore.get(HeadersKey.Latitude)?.value || "";
  const longitude = cookieStore.get(HeadersKey.Longitude)?.value || "";
  const headers = await getHeaders();

  try {
    const reqHeaders = await nextHeaders();
    const xfwd =
      reqHeaders.get("x-forwarded-for") ||
      reqHeaders.get("x-vercel-forwarded-for") ||
      reqHeaders.get("x-real-ip") ||
      reqHeaders.get("cf-connecting-ip") ||
      "";
    const clientIp = xfwd ? xfwd.split(",")[0].trim() : "";
    if (clientIp) {
      headers[HeadersKey.IP] = clientIp;
    }
  } catch {}
  const origin = process.env.NEXTAUTH_URL;
  if (accessToken) headers[HeadersKey.Authorization] = `Bearer ${accessToken}`;
  if (deviceId) headers[HeadersKey.DeviceId] = deviceId;
  if (language) headers[HeadersKey.Lang] = language;
  if (userAgent) headers[HeadersKey.UserAgent] = userAgent;
  if (latitude) headers[HeadersKey.Latitude] = latitude;
  if (longitude) headers[HeadersKey.Longitude] = longitude;
  if (origin) headers[HeadersKey.Origin] = origin;
  return headers;
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
      },
      async authorize(credentials) {
        //#region call login api
        const { email, password } = credentials || {};
        const login = await postFetcher(`${baseUrl}/api/v1/auth/login`, { email, password }, { ...(await header()) });
        if (login.statusCode !== 200) throw new Error(login.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        //#endregion

        //#region get profile
        const { accessToken } = login.data;
        const profile = await getFetcher(`${baseUrl}/api/v1/profile`, { ...(await header(accessToken)) });
        if (profile.statusCode !== 200) throw new Error(profile.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        //#endregion
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
