"use client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

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
  ssrVerifyOtp,
  ssrSetSession,
} from "@/utils/supabase/server";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
  VerifyOtpParams,
} from "@supabase/supabase-js";
import { csrSignInWithGoogle } from "@/utils/supabase/client";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
import { UserContext } from "../UserContext";

type AuthContextType = {
  isLoading: boolean;
  user: User | null; // เพิ่ม user type
  signInWithEmail: (payload: SignInWithPasswordCredentials) => Promise<any>;
  signUpWithEmail: (payload: SignUpWithPasswordCredentials) => Promise<any>;
  signOut: () => Promise<any>;
  refreshSession: () => Promise<void>;
  getSession: () => Promise<any>;
  getUser: () => Promise<any>;
  forgotPassword: (payload: ResetPasswordForEmailType) => Promise<any>;
  resetPassword: (payload: ResetPasswordType) => Promise<any>;
  exchangeCodeForSession: (code: string) => Promise<any>;
  verifyOtp: (payload: VerifyOtpParams) => Promise<any>;
  signInWithGoogle: (redirectTo: string) => Promise<any>;
  setSession: (tokens: { access_token: string; refresh_token: string }) => Promise<any>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setUser: setUserFromContext } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsLoading(true);
    ssrRefreshSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });
  }, []);

  const signInWithEmail = async (payload: SignInWithPasswordCredentials) => {
    setIsLoading(true);
    const response = await ssrSignInWithEmail(payload);
    if (!response.error) {
      setUser(response.data.user);
    }
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
    setUser(null);
    setUserFromContext(null);
    setIsLoading(false);
    return response;
  };

  const refreshSession = async () => {
    setIsLoading(true);
    const { data } = await ssrRefreshSession();
    setUser(data.session?.user ?? null);
    setIsLoading(false);
  };

  const exchangeCodeForSession = async (code: string) => {
    setIsLoading(true);
    const response = await ssrExchangeCodeForSession(code);
    setIsLoading(false);
    return response;
  };

  const verifyOtp = async (payload: VerifyOtpParams) => {
    setIsLoading(true);
    const response = await ssrVerifyOtp(payload);
    setIsLoading(false);
    return response;
  };

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

  const signInWithGoogle = async (redirectTo: string) => {
    setIsLoading(true);
    const response = await csrSignInWithGoogle(redirectTo);
    setIsLoading(false);
    return response;
  };

  const setSession = async ({ access_token, refresh_token }: { access_token: string; refresh_token: string }) => {
    setIsLoading(true);
    const response = await ssrSetSession({ access_token, refresh_token });
    setUser(response.data.session?.user ?? null);
    setIsLoading(false);
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user, // เพิ่ม user ใน provider
        isLoading,
        signOut,
        getUser,
        verifyOtp,
        getSession,
        resetPassword,
        forgotPassword,
        refreshSession,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        exchangeCodeForSession,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
