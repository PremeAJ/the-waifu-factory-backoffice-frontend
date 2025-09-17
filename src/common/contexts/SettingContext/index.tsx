"use client";
import React, { createContext, useContext, useState } from "react";
import { putFetcher } from "@/app/api/globalFetcher";
import { useProfile } from "../ProfileContext";

export interface AppearanceSettings {
  isLanguage: string;
  activeMode: string;
  activeTheme: string;
  isCollapse: string;
}

export interface SettingContextType {
  updateAppearance: (payload: Partial<AppearanceSettings>) => Promise<any>;
  loading: boolean;
}

export const SettingContext = createContext<SettingContextType>({} as SettingContextType);

export const SettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appearanceMutate } = useProfile();
  const [loading, setLoading] = useState(false);

  const updateAppearance = async (payload: Partial<AppearanceSettings>) => {
    setLoading(true);
    const response = await putFetcher("/api/profile/appearance", payload);
    await appearanceMutate();
    setLoading(false);
    return response;
  };

  const value: SettingContextType = { updateAppearance, loading };

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>;
};

export const useSetting = () => useContext(SettingContext);
