import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { postFetcher } from "../../globalFetcher";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // ใช้ postFetcher ที่มีอยู่
          const response = await postFetcher(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          // ตรวจสอบว่า response และ response.data มีค่าหรือไม่
          if (!response || !response.data) {
            // หากไม่มีข้อมูล ให้โยน Error
            // ข้อความ error นี้สามารถนำไปแสดงผลที่หน้าบ้านได้
            throw new Error(response?.message || "Invalid credentials");
          }

          // หาก login สำเร็จ, backend ควรคืนค่า user object และ tokens
          // response.data ควรมีข้อมูล user และ tokens
          // ตัวอย่าง: { user: { id, name, email }, accessToken, refreshToken }
          return response.data;
        } catch (error: any) {
          // ส่งต่อ error message เพื่อให้ NextAuth จัดการ
          throw new Error(error.message || "An unexpected error occurred");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/dashboard/auth/login", // ระบุหน้า login ของคุณ
  },
  callbacks: {
    // Callback นี้จะถูกเรียกหลังจาก authorize function ทำงาน
    async jwt({ token, user }) {
      // `user` คือข้อมูลที่ return จาก `authorize`
      if (user) {
        token.user = user.user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    // Callback นี้จะถูกเรียกเพื่อสร้าง session object ฝั่ง client
    async session({ session, token }) {
      session.user = token.user as any;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
