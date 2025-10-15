"use client";
import { Appearance, AppearanceSettings, ChangeEmailPayload, IsLanguage, ProfileContextType, ProfilePayload, ProfileResponse } from "./interfaces/interface";
import { dataURLToFile } from "@/common/utils/function/file/dataURLToBlob";
import { defaultAppearance } from "./constants/defaultAppearance";
import { getFetcher, putFetcher } from "@/app/api/globalFetcher";
import { showError } from "@/common/utils/dialog";
import { swrOption } from "@/app/api/swrOption";
import { useEncrypt } from "../EncryptContext";
import { useSession } from "next-auth/react";
import imageCompression from "browser-image-compression";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";

export const ProfileContext = createContext<ProfileContextType>({} as ProfileContextType);
const APPEARANCE_KEY = "appearance";

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, update } = useSession();
  const { encrypt } = useEncrypt();
  const [isLanguage , setIsLanguage] = useState<IsLanguage>("th");

  const {
    data: companyListData,
    error: companyListError,
    isLoading: conmpanyListLoading,
    mutate: companyListMutate,
  } = useSWR(session ? "/api/profile/company" : null, getFetcher, swrOption);

  const {
    data: activeCompanyData,
    error: activeCompanyError,
    isLoading: activeCompanyLoading,
    mutate: activeCompanyMutate,
  } = useSWR(session ? "/api/profile/active-company" : null, getFetcher, swrOption);

  const {
    data: appearanceData,
    error: appearanceError,
    isLoading: appearanceLoading,
    mutate: appearanceMutate,
  } = useSWR(session ? "/api/profile/appearance" : null, getFetcher, swrOption);

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

  const appearance: Appearance = {
    ...defaultAppearance,
    ...localAppearance,
    ...appearanceData?.data,
    isLanguage: isLanguage || appearanceData?.data?.isLanguage || localAppearance?.isLanguage || defaultAppearance.isLanguage,
  }

  useEffect(() => {
    console.log("🚀 ~ ProfileProvider ~ appearance:", appearance)
    document.documentElement.setAttribute("class", appearance.activeMode);
    document.documentElement.setAttribute("data-color-theme", appearance.activeTheme);
    document.documentElement.setAttribute("data-sidebar-type", appearance.isCollapse);
    document.documentElement.setAttribute("data-boxed-layout", appearance.isLayout);

  }, [appearance]);

  const updateActiveCompany = async (companyId: string) => {
    try {
      setLoading(true);
      await putFetcher("/api/profile/active-company", { companyId });
      await refreshProfile();
      await companyListMutate();
      setLoading(false);
    } catch (error: any) {
      showError({ title: "เกิดข้อผิดพลาด", message: error.message });
    }
  };

  const refreshProfile = async () => {
    const response = await getFetcher("/api/profile");
    if (response.statusCode !== 200) {
      showError({ title: "เกิดข้อผิดพลาด", message: response.message });
    }
    await update({ profile: response.data });
  };

  const updateProfile = async (payload: Partial<ProfilePayload>): Promise<ProfileResponse> => {
    setLoading(true);
    const response = await putFetcher("/api/profile", payload);
    setLoading(false);
    if (response?.error) {
      showError({ title: "เกิดข้อผิดพลาด", message: response.message });
    }
    await update({ profile: response.data });
    return response;
  };

  const updateAppearance = async (payload: Partial<AppearanceSettings>) => {
    setLoading(true);
    if (payload.isLanguage) {
      setIsLanguage(payload.isLanguage);
    }
    await appearanceMutate({ data: { ...appearance, ...payload } }, false);
    if (session) {
      const response = await putFetcher("/api/profile/appearance", payload);
      if (response?.error) {
        showError({ message: response.message });
      }
    }
    setLoading(false);
  };

  const changeEmail = async (payload: Partial<ChangeEmailPayload>): Promise<any> => {
    setLoading(true);
    const encryptedPayload = {
      newEmail: encrypt(payload.newEmail),
      password: encrypt(payload.password),
    };
    const response = await putFetcher("/api/profile/email", encryptedPayload);
    setLoading(false);
    if (response?.error) {
      showError({ title: "เกิดข้อผิดพลาด", message: response.message });
    }
    return response;
  };

  const uploadAvatar = async (base64: string, fileName: string): Promise<any> => {
    setLoading(true);
    try {
      if (!base64) showError({ title: "เกิดข้อผิดพลาด", message: "ไม่มีไฟล์รูปภาพ" });
      const dataUrl = base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
      let file = dataURLToFile(dataUrl, fileName);
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const fd = new FormData();
      fd.append("file", compressedFile, fileName);
      const response = await putFetcher("/api/profile/avatar", fd);
      if (response?.error) {
        showError({ title: "เกิดข้อผิดพลาด", message: response.message });
      }
      await update({ profile: { ...session?.profile, avatar: response.data } });
      return response;
    } catch (error: any) {
      showError({ title: "เกิดข้อผิดพลาด", message: error?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };
  const value: ProfileContextType = {
    appearance,
    changeEmail,
    uploadAvatar,
    updateProfile,
    refreshProfile,
    appearanceMutate,
    updateAppearance,
    companyListMutate,
    activeCompanyMutate,
    updateActiveCompany,
    companyList: companyListData?.data || [],
    activeCompany: activeCompanyData?.data || null,
    error: activeCompanyError || companyListError || appearanceError,
    loading: activeCompanyLoading || conmpanyListLoading || appearanceLoading || loading,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);
