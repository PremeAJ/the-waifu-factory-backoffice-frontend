import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { postFetcher } from "../../globalFetcher";
import { getHeaders } from "@/common/utils/getHeaders";
import { cookies } from "next/headers";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const cookieStore = await cookies();
        const theme = cookieStore.get("x-lang");
        console.log("🚀 ~ authorize ~ theme:2", theme);

        const { email, password } = credentials || {};
        const headers = getHeaders();
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
