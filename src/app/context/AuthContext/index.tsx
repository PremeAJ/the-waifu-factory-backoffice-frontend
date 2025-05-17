"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  signInPayload,
  ssrGetSession,
  ssrRefreshSession,
  ssrSignInWithEmail,
  ssrSignOut,
  ssrSignUpWithEmail,
} from "@/utils/supabase/server";

type AuthContextType = {
  isLoading: boolean;
  signInWithEmail: (payload: signInPayload) => Promise<any>;
  signUpWithEmail: (payload: signInPayload) => Promise<any>;
  signOut: () => Promise<any>;
  refreshSession: () => Promise<void>;
  getSession: () => Promise<any>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    ssrRefreshSession().then(({ data }) => {
      setIsLoading(false);
    });
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
    setIsLoading(false);
  };

  const getSession = async () => {
    setIsLoading(true);
    const response = await ssrGetSession();
    setIsLoading(false);
    return response;
  };


  return (
    <AuthContext.Provider
      value={{
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshSession,
        getSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
