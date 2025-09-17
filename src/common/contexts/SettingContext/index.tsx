"use client";
import React, { createContext, useContext, useState } from "react";
import { putFetcher } from "@/app/api/globalFetcher";
import { useProfile } from "../ProfileContext";
import { Appearance } from "../ProfileContext/interfaces/interface";
import { useDialog } from "../DialogContext";

export interface AppearanceSettings extends Appearance {}

export interface SettingContextType {
  updateAppearance: (payload: Partial<AppearanceSettings>) => Promise<any>;
  loading: boolean;
}

export const SettingContext = createContext<SettingContextType>({} as SettingContextType);

export const SettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {showError} = useDialog()
  const { appearanceMutate, appearance } = useProfile();
  const [loading, setLoading] = useState(false);

  const updateAppearance = async (payload: Partial<AppearanceSettings>) => {
    setLoading(true);
    await appearanceMutate({ data: { ...appearance, ...payload } }, false);
    const response = await putFetcher("/api/profile/appearance", payload);
    setLoading(false);
    if (response?.error) {
      showError({message: response.message})
    }
    return response;
  };

  const value: SettingContextType = { updateAppearance, loading };

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>;
};

export const useSetting = () => useContext(SettingContext);
