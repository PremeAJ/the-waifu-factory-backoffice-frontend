import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      // เพิ่ม property อื่นๆ ของ user ที่ได้จาก backend
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
  }

  interface User extends DefaultUser {
    // property ที่ได้จาก backend ตอน authorize
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: {
      id: string;
      email: string;
    };
    accessToken: string;
    refreshToken: string;
  }
}
