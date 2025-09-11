"use client";
import React, { createContext, useContext, useState } from "react";
import { postFetcher } from "@/app/api/globalFetcher";

export interface OtpVerifyPayload {
  id: string;
  type: string;
  ref: string;
  otp: string;
}

export interface OtpContextType {
  verifyOtp: (payload: OtpVerifyPayload) => Promise<any>;
  loading: boolean;
}

export const OtpContext = createContext<OtpContextType>({} as OtpContextType);

export const OtpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (payload: OtpVerifyPayload) => {
    setLoading(true);
    const response = await postFetcher("/api/otp/verify", payload);
    setLoading(false);
    return response;
  };

  const value: OtpContextType = { verifyOtp, loading };

  return <OtpContext.Provider value={value}>{children}</OtpContext.Provider>;
};

export const useOtp = () => useContext(OtpContext);