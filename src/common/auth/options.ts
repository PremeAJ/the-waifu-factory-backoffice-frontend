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
        const { email, password, captchaToken } = credentials || {};
        console.log("🚀 ~ authorize ~ `${process.env.NEXTAUTH_URL}/api/authentication/login`:", `${process.env.NEXTAUTH_URL}/api/authentication/login`)
        const login = await postFetcher(
          `${process.env.NEXTAUTH_URL}/api/authentication/login`,
          {
              email,
              password,
              // captchaToken
            },
            {
                ...(await header()),
            }
        );
        console.log("🚀 ~ authorize ~ login.statusCode:", login)
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
        const profileRes = await getFetcher(`${process.env.NEXTAUTH_URL}/api/profile`, { ...(await header(session.accessToken)) });
        session.profile = profileRes.data;
      }
      delete session.user;
      return session;
    },
  },
};

export default authOptions;