"use client";
import React, { createContext, useContext, useState } from "react";
import { postFetcher } from "@/app/api/globalFetcher";

export interface OtpVerifyPayload {
  id: string;
  type: string;
  ref: string;
  otp: string;
}

export interface OtpResendPayload {
  id: string;
  type: string;
  ref: string;
}

export interface OtpContextType {
  verifyOtp: (payload: OtpVerifyPayload) => Promise<any>;
  resendOtp: (payload: OtpResendPayload) => Promise<any>;
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

  const resendOtp = async (payload: OtpResendPayload) => {
    setLoading(true);
    const response = await postFetcher("/api/otp/resend", payload);
    setLoading(false);
    return response;
  };

  const value: OtpContextType = { verifyOtp, resendOtp, loading };

  return <OtpContext.Provider value={value}>{children}</OtpContext.Provider>;
};

export const useOtp = () => useContext(OtpContext);