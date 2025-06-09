"use client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import {
  ResetPasswordForEmailType,
  ResetPasswordType,
  supabaseExchangeCodeForSession,
  supabaseForgotPassword,
  supabaseGetSession,
  supabaseGetUser,
  supabaseRefreshSession,
  supabaseResetPassword,
  supabaseSignInWithEmail,
  supabaseSignOut,
  supabaseSignUpWithEmail,
  supabaseSetSession,
  supabaseVerifyOtp,
} from "@/utils/supabase/server";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
  VerifyOtpParams,
} from "@supabase/supabase-js";
import { supabaseSignInWithGoogle } from "@/utils/supabase/client";
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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsLoading(true);
    supabaseRefreshSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });
  }, []);

  const signInWithEmail = async (payload: SignInWithPasswordCredentials) => {
    setIsLoading(true);
    const response = await supabaseSignInWithEmail(payload);
    if (!response.error) {
      setUser(response.data.user);
    }
    setIsLoading(false);
    return response;
  };

  const signUpWithEmail = async (payload: SignUpWithPasswordCredentials) => {
    setIsLoading(true);
    const response = await supabaseSignUpWithEmail(payload);
    setIsLoading(false);
    return response;
  };

  const forgotPassword = async (payload: ResetPasswordForEmailType) => {
    setIsLoading(true);
    const response = await supabaseForgotPassword(payload);
    setIsLoading(false);
    return response;
  };

  const resetPassword = async (payload: ResetPasswordType) => {
    setIsLoading(true);
    const response = await supabaseResetPassword(payload);
    setIsLoading(false);
    return response;
  };

  const signOut = async () => {
    setIsLoading(true);
    const response = await supabaseSignOut();
    setUser(null);
    // setUserFromContext(null);
    setIsLoading(false);
    return response;
  };

  const refreshSession = async () => {
    setIsLoading(true);
    const { data } = await supabaseRefreshSession();
    setUser(data.session?.user ?? null);
    setIsLoading(false);
  };

  const exchangeCodeForSession = async (code: string) => {
    setIsLoading(true);
    const response = await supabaseExchangeCodeForSession(code);
    setIsLoading(false);
    return response;
  };

  const verifyOtp = async (payload: VerifyOtpParams) => {
    setIsLoading(true);
    const response = await supabaseVerifyOtp(payload);
    setIsLoading(false);
    return response;
  };

  const getSession = async () => {
    setIsLoading(true);
    const response = await supabaseGetSession();
    setIsLoading(false);
    return response;
  };

  const getUser = async () => {
    setIsLoading(true);
    const response = await supabaseGetUser();
    setIsLoading(false);
    return response;
  };

  const signInWithGoogle = async (redirectTo: string) => {
    setIsLoading(true);
    const response = await supabaseSignInWithGoogle(redirectTo);
    setIsLoading(false);
    return response;
  };

  const setSession = async ({ access_token, refresh_token }: { access_token: string; refresh_token: string }) => {
    setIsLoading(true);
    const response = await supabaseSetSession({ access_token, refresh_token });
    setUser(response.data.session?.user ?? null);
    setIsLoading(false);
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
