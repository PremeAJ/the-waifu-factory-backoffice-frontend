"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import {
  signInPayload,
  ssrRefreshSession,
  ssrSignInWithEmail,
  ssrSignOut,
  ssrSignUpWithEmail,
} from "./action";

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
  }, []);

  const signInWithEmail = async (payload: signInPayload) => {
    setIsLoading(true);
    const response = await ssrSignInWithEmail(payload);
    setSession(response.data?.session ?? null);
    setIsLoading(false);
    return response;
  };

  const signUpWithEmail = async (payload: signInPayload) => {
    setIsLoading(true);
    const response = await ssrSignUpWithEmail(payload);
    setSession(response.data?.session ?? null);
    setIsLoading(false);
    return response;
  };

  const signOut = async () => {
    setIsLoading(true);
    const response = await ssrSignOut();
    setSession(null);
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

export const useAuth = () => useContext(AuthContext);
