"use client";
import React, { createContext, useState } from "react";
import { postFetcher } from "@/app/api/globalFetcher";
import { useDialog } from "../DialogContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PageUrl } from "@/common/constants/pageUrl";
import { useProfile } from "../ProfileContext";

export interface CompanyType {
  id: string;
  businessTypeId: number | null;
  companyAddress: string;
  companyEmail: string;
  companyName: string;
  consents: { id: string; accepted: boolean }[];
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  districtId: number | null;
  logoUrl?: string;
  name?: string;
  provinceId: number | null;
  subdistrictId: number | null;
  taxId: string;
  zipcodeId: number | null;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError, showSuccess } = useDialog();
  const { data: session, update: updateSession } = useSession();
  const { companyList, companyListMutate, activeCompanyMutate } = useProfile();

  const createCompany = async (payload: Omit<CompanyType, "id">) => {
    setLoading(true);
    setError(null);
    const response = await postFetcher("/api/company", payload);
    if (response.statusCode !== 201) showError({ message: response.message, title: "เกิดข้อผิดพลาด" });
    await updateSession({ profile: { ...session?.profile, activeCompany: response?.data?.company?.id } });
    const { id, name, logoUrl } = response?.data?.company;
    const { nameTh: RoleNameTh, nameEn: RoleNameEn } = response?.data?.roles;
    const { nameTh: branchNameTh, nameTh: branchNameEn } = response?.data?.branch;
    await companyListMutate(
      {
        data: [
          {
            companies: {
              id: id,
              name: name,
              logoUrl: logoUrl,
              businessTypeId: payload.businessTypeId,
            },
            roles: {
              nameTh: RoleNameTh,
              nameEn: RoleNameEn,
            },
          },
          ...companyList,
        ],
      },
      false
    );
    await activeCompanyMutate({
      data: {
        name: name,
        logoUrl: logoUrl,
        businessTypeId: payload.businessTypeId,
        branchNameTh: branchNameTh,
        branchNameEn: branchNameEn,
      },
    }, false);
    showSuccess({ message: "กำลังพาไปหน้า Dashboard...", title: "สำเร็จ", callback: PageUrl.DASHBOARD });
    setLoading(false);
    return response;
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

export const useCompany = () => React.useContext(CompanyContext);
