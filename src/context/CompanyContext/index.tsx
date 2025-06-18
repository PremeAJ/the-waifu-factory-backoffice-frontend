"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import useSWR from "swr";
import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import { UserContext } from "../UserContext";

export interface CompanyType {
  id: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  consent: { id: string; accepted: boolean }[];
  provinceId: number | null;
  districtId: number | null;
  subdistrictId: number | null;
  zipcodeId: number | null;
  businessTypeId: number | null;
  taxId: string;
  name?: string;
  logoUrl?: string;
}

export type CompanyContextType = {
  company: CompanyType | null;
  setCompany: React.Dispatch<React.SetStateAction<CompanyType | null>>;
  loading: boolean;
  error: Error | null;
  createCompany: (payload: Omit<CompanyType, "id">) => Promise<any>;
  refreshCompany: () => void;
};

export const CompanyContext = createContext<CompanyContextType>({} as CompanyContextType);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {userMutate} = useContext(UserContext)
  const [company, setCompany] = useState<CompanyType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { data, isLoading, error: swrError, mutate } = useSWR("/api/company/me", getFetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (data?.data) setCompany(data.data);
    setLoading(isLoading);
    if (swrError) setError(swrError);
  }, [data, isLoading, swrError]);

  const createCompany = async (payload: Omit<CompanyType, "id">) => {
    setLoading(true);
    setError(null);
    try {
      await postFetcher("/api/company", payload);
      await mutate(); 
      await userMutate(); 
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw new Error(process.env.NODE_ENV === 'development' && err || "เกิดข้อผิดพลาดในการสร้างบริษัท กรุณาลองใหม่อีกครั้ง");
    }
  };

  const refreshCompany = () => mutate();

  const value: CompanyContextType = {
    company,
    setCompany,
    loading,
    error,
    createCompany,
    refreshCompany,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};
