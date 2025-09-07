"use client";
import { AuthContextType, Register } from "./interfaces/interface";
import { postFetcher } from "@/app/api/globalFetcher";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect } from "react";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { update: updateSession, status } = useSession();

  const register = async (payload: Register) => {
    setLoading(true);
    const response = await postFetcher("/api/authentication/register", payload);
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
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
