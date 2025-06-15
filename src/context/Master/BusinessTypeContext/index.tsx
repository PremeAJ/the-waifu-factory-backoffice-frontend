"use client";
import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import React from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";

export interface BusinessTypeCategory {
  id: number;
  nameTh: string;
  nameEn: string;
  isActive: boolean;
}

export interface BusinessType {
  id: number;
  nameTh: string;
  nameEn: string;
  isActive: boolean;
  businessTypeCategoryId: number;
  businessTypeCategories?: BusinessTypeCategory;
}

export interface BusinessTypeContextProps {
  businessTypes: BusinessType[];
  isLoading: boolean;
  error: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
  mutateBusinessType: () => void;
}

export const BusinessTypeContext = createContext<BusinessTypeContextProps>({
  businessTypes: [],
  isLoading: true,
  error: "",
  setLoading: () => {},
  setError: () => {},
  mutateBusinessType: () => {},
});

export const BusinessTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { data: BusinessTyppeData, isLoading: swrLoading, error: swrError, mutate } = useSWR("/api/master/business-type", getFetcher);

  useEffect(() => {
    if (BusinessTyppeData) {
      setBusinessTypes(BusinessTyppeData.data);
      setLoading(swrLoading);
    } else if (swrError) {
      setError(swrError.message);
      setLoading(swrLoading);
      console.log("Failed to fetch business type data");
    } else {
      setLoading(swrLoading);
    }
  }, [BusinessTyppeData, swrError, swrLoading]);

  const value: BusinessTypeContextProps = {
    businessTypes,
    isLoading,
    error,
    setError,
    setLoading,
    mutateBusinessType: mutate,
  };

  return <BusinessTypeContext.Provider value={value}>{children}</BusinessTypeContext.Provider>;
};
