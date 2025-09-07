"use client";
import { AuthContextType, Register } from "./interfaces/interface";
import { postFetcher } from "@/app/api/globalFetcher";
import { useError } from "../ErrorContext";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect } from "react";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { update: updateSession, status } = useSession();
  const { showError } = useError();

  const register = async (payload: Register) => {
    try {
      console.log("🚀 ~ register ~ payload:", payload);
      await postFetcher("/api/auth/register", payload);
      await updateSession();
    } catch (error: any) {
      showError(error.message, "เกิดข้อผิดพลาดใรการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง");
    }
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
