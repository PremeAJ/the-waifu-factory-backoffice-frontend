"use client";
import React, { createContext, useState } from "react";
import { postFetcher } from "@/app/api/globalFetcher";
import { useDialog } from "../DialogContext";

export interface CompanyType {
  id: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  consents: { id: string; accepted: boolean }[];
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
};

export const CompanyContext = createContext<CompanyContextType>({} as CompanyContextType);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<CompanyType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useDialog();

  const createCompany = async (payload: Omit<CompanyType, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postFetcher("/api/company", payload);
      setLoading(false);
      if (response.statusCode !== 201) showError({ message: response.message, title: "เกิดข้อผิดพลาด" });
      return response;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw new Error((process.env.NODE_ENV === "development" && err) || "เกิดข้อผิดพลาดในการสร้างบริษัท กรุณาลองใหม่อีกครั้ง");
    }
  };

  const value: CompanyContextType = {
    company,
    setCompany,
    loading,
    error,
    createCompany,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};
