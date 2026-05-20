"use client";
import { Appearance, AppearanceSettings, ProfileContextType } from "./interfaces/interface";
import { defaultAppearance } from "./constants/defaultAppearance";
import React, { createContext, useContext, useEffect, useState } from "react";

export const ProfileContext = createContext<ProfileContextType>({} as ProfileContextType);
const APPEARANCE_KEY = "appearance";

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localAppearance, setLocalAppearance] = useState<Appearance>(defaultAppearance);
  const [isLanguage, setIsLanguage] = useState(defaultAppearance.isLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(APPEARANCE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalAppearance(parsed);
        if (parsed.isLanguage) setIsLanguage(parsed.isLanguage);
      }
    }
  }, []);

  const appearance: Appearance = {
    ...defaultAppearance,
    ...localAppearance,
    isLanguage,
  };

  useEffect(() => {
    document.documentElement.setAttribute("class", appearance.activeMode);
    document.documentElement.setAttribute("data-color-theme", appearance.activeTheme);
    document.documentElement.setAttribute("data-sidebar-type", appearance.isCollapse);
    document.documentElement.setAttribute("data-boxed-layout", appearance.isLayout);
  }, [appearance]);

  const updateAppearance = async (payload: Partial<AppearanceSettings>) => {
    if (payload.isLanguage) setIsLanguage(payload.isLanguage);
    setLocalAppearance((curr) => {
      const next = { ...curr, ...payload };
      if (typeof window !== "undefined") {
        localStorage.setItem(APPEARANCE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const value: ProfileContextType = {
    appearance,
    updateAppearance,
    loading: false,
    profileLoading: false,
    appearanceLoading: false,
    error: null,
    companyList: [],
    activeCompany: null,
    refreshProfile: async () => {},
    appearanceMutate: async () => {},
    companyListMutate: async () => {},
    activeCompanyMutate: async () => {},
    updateActiveCompany: async () => {},
    uploadAvatar: async () => {},
    changeEmail: async () => {},
    updateProfile: async () => ({} as any),
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);
