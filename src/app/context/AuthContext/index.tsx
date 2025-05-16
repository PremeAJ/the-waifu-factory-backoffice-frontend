"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Session, User } from "@supabase/supabase-js";
import {
  ssrRefreshSession,
  ssrSignInWithEmail,
  ssrSignOut,
  ssrSignUpWithEmail,
} from "./action";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ใช้ createBrowserClient จาก @supabase/ssr
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  refreshSession: () => Promise<void>;
};


export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    ssrRefreshSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    return ssrSignInWithEmail(email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    return ssrSignUpWithEmail(email, password);
  };

  const signOut = async () => {
    return ssrSignOut();
  };

  const refreshSession = async () => {
    const { data } = await ssrRefreshSession();
    setSession(data.session);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook สำหรับใช้ context นี้
export const useAuth = () => useContext(AuthContext);
