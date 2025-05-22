"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  ResetPasswordForEmailType,
  ResetPasswordType,
  ssrExchangeCodeForSession,
  ssrForgotPassword,
  ssrGetSession,
  ssrGetUser,
  ssrRefreshSession,
  ssrResetPassword,
  ssrSignInWithEmail,
  ssrSignOut,
  ssrSignUpWithEmail,
} from "@/utils/supabase/server";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";

type AuthContextType = {
  isLoading: boolean;
  signInWithEmail: (payload: SignInWithPasswordCredentials) => Promise<any>;
  signUpWithEmail: (payload: SignUpWithPasswordCredentials) => Promise<any>;
  signOut: () => Promise<any>;
  refreshSession: () => Promise<void>;
  getSession: () => Promise<any>;
  getUser: () => Promise<any>;
  forgotPassword: (payload: ResetPasswordForEmailType) => Promise<any>;
  resetPassword: (payload: ResetPasswordType) => Promise<any>;
  exchangeCodeForSession: (code: string) => Promise<any>;
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

  const signInWithEmail = async (payload: SignInWithPasswordCredentials) => {
    setIsLoading(true);
    const response = await ssrSignInWithEmail(payload);
    setIsLoading(false);
    return response;
  };

  const signUpWithEmail = async (payload: SignUpWithPasswordCredentials) => {
    setIsLoading(true);
    const response = await ssrSignUpWithEmail(payload);
    setIsLoading(false);
    return response;
  };

  const forgotPassword = async (payload: ResetPasswordForEmailType) => {
    setIsLoading(true);
    const response = await ssrForgotPassword(payload);
    setIsLoading(false);
    return response;
  };

    const resetPassword = async (payload: ResetPasswordType) => {
    setIsLoading(true);
    const response = await ssrResetPassword(payload);
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

  const exchangeCodeForSession = async (code: string) => {
    setIsLoading(true);
    const response = await ssrExchangeCodeForSession(code);
    setIsLoading(false);
    return response;
  }

  const getSession = async () => {
    setIsLoading(true);
    const response = await ssrGetSession();
    setIsLoading(false);
    return response;
  };

  const getUser = async () => {
    setIsLoading(true);
    const response = await ssrGetUser();
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
        getSession,
        getUser,
        forgotPassword,
        resetPassword,
        exchangeCodeForSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
