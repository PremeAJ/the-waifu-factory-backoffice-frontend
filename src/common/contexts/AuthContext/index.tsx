"use client";
import { AuthContextType } from "./interfaces/interface";
import React, { createContext, useContext, useEffect } from "react";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  //#region อัพเดทบริษัทที่ใช้งานอยู่
  const updateActiveCompany = async (companyId: string) => {
    // try {
    //   setLoading(true);
    //   await putFetcher("/api/profile/active-company", { companyId });
    //   await updateSession();
    //   setLoading(false);
    // } catch (error: any) {
    //   showError(error.message, "เกิดข้อผิดพลาด");
    // }
  };
  //#endregion

  const value: AuthContextType = {
    updateActiveCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
