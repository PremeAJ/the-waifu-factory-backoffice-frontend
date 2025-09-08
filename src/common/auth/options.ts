import CredentialsProvider from "next-auth/providers/credentials";
import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import { cookies } from "next/headers";
import { HeadersKey } from "../constants/header";
import { getHeaders } from "../utils/getHeaders";
import { v4 as uuidv4 } from "uuid";
import { AuthOptions } from "next-auth";
import { signOut } from "next-auth/react";

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
        const { email, password, captchaToken } = credentials || {};
        const login = await postFetcher(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
          {
            email,
            password,
            // captchaToken
          },
          {
            ...(await header()),
          }
        );
        if (login.statusCode !== 200) throw new Error(login.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        //#endregion

        return login.data;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.profile = user.profile;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.profile = token.profile;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      if (session.accessToken) {
        const profileRes = await getFetcher(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile`,
          { ...(await header(session.accessToken)) }
        );
        if (profileRes.statusCode !== 200) {
          return {} as typeof session;
        }
        session.profile = profileRes.data;
      }
      delete session.user;
      return session;
    },
  },
};

export default authOptions;
