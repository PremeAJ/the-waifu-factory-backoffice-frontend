"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";

export interface ConsentType {
  id: number;
  type: string;
  content: string;
  // เพิ่ม field อื่นๆ ตามที่ API ส่งกลับมา
}

interface ConsentContextProps {
  consentData: ConsentType | null;
  isLoading: boolean;
  error: string;
  getConsentData: (type: string) => void;
}

const ConsentContext = createContext<ConsentContextProps>({
  consentData: null,
  isLoading: false,
  error: "",
  getConsentData: () => {},
});

export const ConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [type, setType] = useState<string | null>(null);

  const { data, isLoading, error } = useSWR(
    type ? [`/api/master/consent/${type}`] : null,
    getFetcher
  );

  const getConsentData = (consentType: string) => {
    setType(consentType);
  };

  return (
    <ConsentContext.Provider
      value={{
        consentData: data?.data || null,
        isLoading,
        error: error?.message || "",
        getConsentData,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => useContext(ConsentContext);