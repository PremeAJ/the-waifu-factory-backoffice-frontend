import CredentialsProvider from "next-auth/providers/credentials";
import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import { cookies } from "next/headers";
import { HeadersKey } from "../constants/header";
import { getHeaders } from "../utils/getHeaders";
import { v4 as uuidv4 } from "uuid";
import { AuthOptions } from "next-auth";

async function header(accessToken?: string) {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get(HeadersKey.DeviceId)?.value;
  if (!deviceId) {
    deviceId = uuidv4();
    cookieStore.set(HeadersKey.DeviceId, deviceId, { path: "/" });
  }
  const language = cookieStore.get(HeadersKey.Lang)?.value || "th";
  const headers = getHeaders();
  if (deviceId) headers[HeadersKey.DeviceId] = deviceId;
  if (language) headers[HeadersKey.Lang] = language;
  if (accessToken) headers[HeadersKey.Authorization] = `Bearer ${accessToken}`;
  return headers;
}

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
        const login = await postFetcher(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, { email, password }, { ...(await header()) });
        if (login.statusCode !== 200) throw new Error(login.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        //#endregion

        //#region get profile
        const { accessToken } = login.data;
        const profile = await getFetcher(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile`, { ...(await header(accessToken)) });
        if (profile.statusCode !== 200) throw new Error(profile.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        //#endregion
        return { ...login.data, profile: profile.data };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        if (user.accessToken) token.accessToken = user.accessToken;
        if (user.refreshToken) token.refreshToken = user.refreshToken;
        if (user.profile) token.profile = user.profile;
      }
      if (session) {
        if (session.profile) token.profile = session.profile;
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
