"use client";
import React, { createContext, useContext, ReactNode } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
import { swrOption } from "@/app/api/swrOption";

export interface ConsentType {
  id: string;
  type: string;
  text: string;
  detailTh: string;
  detailEn: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // เพิ่ม field อื่นๆ ตามที่ API ส่งกลับมา
}

interface ConsentContextProps {
  consents: ConsentType[];
  isLoading: boolean;
  error: string;
  getConsentData: (type: string) => ConsentType | undefined;
}

export const ConsentContext = createContext<ConsentContextProps>({
  consents: [],
  isLoading: false,
  error: "",
  getConsentData: () => undefined,
});

export const ConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data, isLoading, error } = useSWR("/api/master/consent", getFetcher, swrOption);

  const consents: ConsentType[] = data?.data || [];

  const getConsentData = (type: string) => {
    return consents.find((consent) => consent.type === type);
  };

  return (
    <ConsentContext.Provider
      value={{
        consents,
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