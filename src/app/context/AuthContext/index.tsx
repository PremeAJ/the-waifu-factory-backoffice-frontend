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
  signInPayload,
  ssrRefreshSession,
  ssrSignInWithEmail,
  ssrSignOut,
  ssrSignUpWithEmail,
} from "./action";
import { set } from "lodash";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (payload: signInPayload) => Promise<any>;
  signUpWithEmail: (payload: signInPayload) => Promise<any>;
  signOut: () => Promise<any>;
  refreshSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    ssrRefreshSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (payload: signInPayload) => {
    setIsLoading(true);
    const response = await ssrSignInWithEmail(payload);
    setIsLoading(false);
    return response;
  };

  const signUpWithEmail = async (payload: signInPayload) => {
    setIsLoading(true);
    const response = await ssrSignUpWithEmail(payload);
    setIsLoading(false);
    return response;
  };

  const signOut = async () => {
    setIsLoading(true);
    const response = await ssrSignOut();
    setIsLoading(false);
    return response;
  };

  const refreshSession = async () => {
    setIsLoading(true);
    const { data } = await ssrRefreshSession();
    setSession(data.session);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
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
