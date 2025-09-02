import { cookies } from "next/headers";
import { getHeaders } from "@/common/utils/getHeaders";
import { HeadersKey } from "@/common/constants/header";
import { postFetcher } from "../../globalFetcher";
import {v4 as uuidv4} from "uuid";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //#region setup header
        const cookieStore = await cookies();
        const headers = getHeaders();

        let deviceId = cookieStore.get(HeadersKey.DeviceId)?.value;
        if (!deviceId) {deviceId = uuidv4(); cookieStore.set(HeadersKey.DeviceId, deviceId);}
        
        const language = cookieStore.get(HeadersKey.Lang)?.value || "th";
        
        if (deviceId) headers[HeadersKey.DeviceId] = deviceId;
        if (language) headers[HeadersKey.Lang] = language;
        //#endregion setup header

        //#region call login api
        const { email, password } = credentials || {};
        const response = await postFetcher(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/auth/login`,
          {
            email,
            password,
          },
          headers
        );
        if (response.statusCode !== 200) throw new Error(response.message || "Invalid credentials");
        return response;
        //#endregion
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
