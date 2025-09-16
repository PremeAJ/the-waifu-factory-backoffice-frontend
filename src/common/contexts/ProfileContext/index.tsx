"use client";
import { Appearance, ProfileContextType } from "./interfaces/interface";
import { defaultAppearance } from "./constants/defaultAppearance";
import { getFetcher, putFetcher } from "@/app/api/globalFetcher";
import { useDialog } from "../DialogContext";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";

export const ProfileContext = createContext<ProfileContextType>({} as ProfileContextType);
const APPEARANCE_KEY = "appearance";

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, update } = useSession();
  const { showError } = useDialog();

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

  // อ่าน appearance จาก localStorage ก่อน
  const [localAppearance, setLocalAppearance] = useState<Appearance>(defaultAppearance);

  // ดึงจาก localStorage หลัง mount (client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(APPEARANCE_KEY);
      if (stored) setLocalAppearance(JSON.parse(stored));
    }
  }, []);

  // ถ้า API มีข้อมูล ให้ set ลง localStorage และใช้ข้อมูลจาก API
  useEffect(() => {
    if (appearanceData?.data) {
      localStorage.setItem(APPEARANCE_KEY, JSON.stringify(appearanceData.data));
      setLocalAppearance(appearanceData.data);
    }
  }, [appearanceData?.data]);

  // appearance จะเลือกตามลำดับ: API > localStorage > default
  const appearance: Appearance = appearanceData?.data || localAppearance || defaultAppearance;

  useEffect(() => {
    document.documentElement.setAttribute("class", appearance.activeMode);
    document.documentElement.setAttribute("data-color-theme", appearance.activeTheme);
    document.documentElement.setAttribute("data-sidebar-type", appearance.isCollapse);
  }, [appearance]);
  //#endregion

  //#region อัพเดทบริษัทที่ใช้งานอยู่
  const updateActiveCompany = async (companyId: string) => {
    try {
      setLoading(true);
      await putFetcher("/api/profile/active-company", { companyId });
      await updateProfile();
      await companyListMutate();
      setLoading(false);
    } catch (error: any) {
      showError({
        message: error.message,
        title: "เกิดข้อผิดพลาด",
      })
    }
  };
  //#endregion

  //#region update profile
  const updateProfile = async () => {
    const response = await getFetcher("/api/profile");
    if (response.statusCode !== 200) {
       showError({
        message: response.message,
        title: "เกิดข้อผิดพลาด",
      })
    }
    await update({ profile: response.data });
  };
  //#endregion

  const value: ProfileContextType = {
    updateProfile,
    appearanceMutate,
    companyListMutate,
    updateActiveCompany,
    activeCompanyMutate,
    companyList: companyListData?.data || [],
    activeCompany: activeCompanyData?.data || null,
    appearance,
    error: activeCompanyError || companyListError || appearanceError,
    loading: activeCompanyLoading || conmpanyListLoading || appearanceLoading || loading,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);
