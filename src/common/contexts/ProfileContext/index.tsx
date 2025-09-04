"use client";
import { defaultAppearance } from "./constants/defaultAppearance";
import { getFetcher, putFetcher } from "@/app/api/globalFetcher";
import { Appearance, ProfileContextType } from "./interfaces/interface";
import { useError } from "../ErrorContext";
import { useSession } from "next-auth/react";
import React, { createContext, use, useContext, useEffect } from "react";
import useSWR from "swr";

export const ProfileContext = createContext<ProfileContextType>({} as ProfileContextType);
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { data: session, update: updateSession } = useSession();
  const { showError } = useError();

  //#region ลิสต์บริษัทที่ผู้ใช้มีสิทธิ์เข้าใช้งาน
  const {
    data: companyListData,
    error: companyListError,
    isLoading: conmpanyListLoading,
    mutate: companyListMutate,
  } = useSWR(session ? "/api/profile/company" : null, getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });
  //#endregion

  //#region บริษัทที่ผู้ใช้เลือกใช้งานอยู่
  const {
    data: activeCompanyData,
    error: activeCompanyError,
    isLoading: activeCompanyLoading,
    mutate: activeCompanyMutate,
  } = useSWR(session ? "/api/profile/active-company" : null, getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });
  //#endregion

  //#region ลักษณะการแสดงผลของผู้ใช้
  const {
    data: appearanceData,
    error: appearanceError,
    isLoading: appearanceLoading,
    mutate: appearanceMutate,
  } = useSWR(session ? "/api/profile/appearance" : null, getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });
  const appearance: Appearance = appearanceData?.data || defaultAppearance;
  useEffect(() => {
    console.log("🚀 ~ ProfileProvider ~ appearance:", appearance);
    document.documentElement.setAttribute("class", 'dark');
    // document.documentElement.setAttribute("dir", activeDir);
    document.documentElement.setAttribute("data-color-theme", appearance.activeTheme);
    // document.documentElement.setAttribute("data-layout", activeLayout);
    // document.documentElement.setAttribute("data-boxed-layout", isLayout);
    document.documentElement.setAttribute("data-sidebar-type", appearance.isCollapse);
  }, [appearance]);
  //#endregion

  //#region อัพเดทบริษัทที่ใช้งานอยู่
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
  //#endregion

  const value: ProfileContextType = {
    companyList: companyListData?.data || [],
    activeCompany: activeCompanyData?.data || null,
    appearance: appearanceData?.data || defaultAppearance,
    loading: activeCompanyLoading || conmpanyListLoading || appearanceLoading || loading,
    error: activeCompanyError || companyListError || appearanceError,
    companyListMutate,
    updateActiveCompany,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);
