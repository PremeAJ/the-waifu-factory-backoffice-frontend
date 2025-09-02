"use client";

import useSWR from "swr";
import React, { createContext, use, useContext } from "react";
import { getFetcher, putFetcher } from "@/app/api/globalFetcher";
import { ActiveCompany, Company, CompanyListItem } from "./interfaces/interface";
import { useError } from "../ErrorContext";
import { useSession } from "next-auth/react";

interface ProfileContextType {
  activeCompany: ActiveCompany | null;
  companyList: CompanyListItem[];
  loading: boolean;
  error: any;
  companyListMutate: () => void;
  updateActiveCompany: (companyId: string) => Promise<any>;
}

export const ProfileContext = createContext<ProfileContextType>({} as ProfileContextType);
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showError } = useError();
  const { data: session, update: updateSession } = useSession();

  const [loading, setLoading] = React.useState<boolean>(false);
  const {
    data: companyListData,
    error: companyListError,
    isLoading: conmpanyListLoading,
    mutate: companyListMutate,
  } = useSWR("/api/profile/company", getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });

  const {
    data: activeCompanyData,
    error: activeCompanyError,
    isLoading: activeCompanyLoading,
    mutate: activeCompanyMutate,
  } = useSWR("/api/profile/active-company", getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });

  const updateActiveCompany = async (companyId: string) => {
    try {
      setLoading(true);
      await putFetcher("/api/profile/active-company", { companyId });
      await updateSession();
      await companyListMutate();
      setLoading(false);
    } catch (error: any) {
      showError(error.message, "เกิดข้อผิดพลาด");
    }
  };

  const value: ProfileContextType = {
    companyList: companyListData?.data || [],
    activeCompany: activeCompanyData?.data || null,
    loading: activeCompanyLoading || conmpanyListLoading || loading,
    error: activeCompanyError || companyListError,
    companyListMutate,
    updateActiveCompany,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);
