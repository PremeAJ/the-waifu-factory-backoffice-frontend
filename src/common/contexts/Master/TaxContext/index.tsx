"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";
import { swrOption } from "@/app/api/swrOption";

export interface TaxType {
  id: string;
  nameTh: string;
  nameEn?: string;
  descriptionTh?: string;
  descriptionEn?: string;
  rate: number;
  isDefault?: boolean;
}

interface TaxContextProps {
  taxes: TaxType[];
  loading: boolean;
  error: string;
  refresh: () => Promise<any>;
}

export const TaxContext = createContext<TaxContextProps>({
  taxes: [],
  loading: false,
  error: "",
  refresh: async () => {},
});

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data, isLoading, error, mutate } = useSWR("/api/master/tax", getFetcher, swrOption);

  return (
    <TaxContext.Provider
      value={{
        taxes: data?.data || [],
        loading: Boolean(isLoading),
        error: error?.message || "",
        refresh: async () => mutate(),
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = () => useContext(TaxContext);
