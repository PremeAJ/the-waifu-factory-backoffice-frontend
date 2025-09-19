"use client";
import { AuthContextType, ForgotPasswordPayload, ForgotPasswordResponse, RegisterPayload, ResetPasswordPayload } from "./interfaces/interface";
import { postFetcher } from "@/app/api/globalFetcher";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import React, { createContext, useContext, useEffect } from "react";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { status } = useSession();

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    const response = await postFetcher("/api/authentication/register", payload);
    setLoading(false);
    return response;
  };

  const signOut = async () => {
    setLoading(true);
    const response = await postFetcher("/api/authentication/logout", {});
    await nextAuthSignOut();
    setLoading(false);
    return response;
  };

  const forgotPassword = async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
    setLoading(true);
    const response = await postFetcher("/api/authentication/forgot-password", payload);
    setLoading(false);
    return response;
  };

  const resetPassword = async (payload: ResetPasswordPayload): Promise<any> => {
    setLoading(true);
    const response = await postFetcher("/api/authentication/reset-password", payload);
    setLoading(false);
    return response;
  };

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);
  const value: AuthContextType = {
    register,
    signOut,
    forgotPassword,
    resetPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
