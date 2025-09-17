"use client";
import { Appearance, ProfileContextType, ProfilePayload, ProfileResponse } from "./interfaces/interface";
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

  const [localAppearance, setLocalAppearance] = useState<Appearance>(defaultAppearance);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(APPEARANCE_KEY);
      if (stored) setLocalAppearance(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (appearanceData?.data) {
      localStorage.setItem(APPEARANCE_KEY, JSON.stringify(appearanceData.data));
      setLocalAppearance(appearanceData.data);
    }
  }, [appearanceData?.data]);

  const appearance: Appearance = appearanceData?.data || localAppearance || defaultAppearance;

  useEffect(() => {
    document.documentElement.setAttribute("class", appearance.activeMode);
    document.documentElement.setAttribute("data-color-theme", appearance.activeTheme);
    document.documentElement.setAttribute("data-sidebar-type", appearance.isCollapse);
  }, [appearance]);

  const updateActiveCompany = async (companyId: string) => {
    try {
      setLoading(true);
      await putFetcher("/api/profile/active-company", { companyId });
      await refreshProfile();
      await companyListMutate();
      setLoading(false);
    } catch (error: any) {
      showError({
        message: error.message,
        title: "เกิดข้อผิดพลาด",
      });
    }
  };

  const refreshProfile = async () => {
    const response = await getFetcher("/api/profile");
    if (response.statusCode !== 200) {
      showError({
        message: response.message,
        title: "เกิดข้อผิดพลาด",
      });
    }
    await update({ profile: response.data });
  };

  const updateProfile = async (payload: Partial<ProfilePayload>): Promise<ProfileResponse> => {
    setLoading(true);
    const response = await putFetcher("/api/profile", payload);
    setLoading(false);
    if (response?.error) {
      showError({ message: response.message });
    }
    await update({ profile: response.data });
    return response;
  };

  const value: ProfileContextType = {
    activeCompany: activeCompanyData?.data || null,
    activeCompanyMutate,
    appearance,
    appearanceMutate,
    companyList: companyListData?.data || [],
    companyListMutate,
    error: activeCompanyError || companyListError || appearanceError,
    loading: activeCompanyLoading || conmpanyListLoading || appearanceLoading || loading,
    refreshProfile,
    updateActiveCompany,
    updateProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);
