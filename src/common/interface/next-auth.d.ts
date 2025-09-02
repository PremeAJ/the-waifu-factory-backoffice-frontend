import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  nickName: string;
  avatar: string;
  email: string;
  phone: string;
  activeCompany: string | null;
  hasReceivedTrial: boolean;
}

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    profile?: Profile;
  }

  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    profile?: Profile;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
    profile?: Profile;
  }
}
