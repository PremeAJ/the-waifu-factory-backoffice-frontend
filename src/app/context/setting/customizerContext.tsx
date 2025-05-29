"use client";
import { createContext, useState, ReactNode, useEffect, useContext } from "react";
import config from "./config";
import React from "react";
import Cookies from "js-cookie";
import useSWR from "swr";
import { set } from "lodash";
import { getFetcher, patchFetcher } from "@/app/api/globalFetcher";
import { UserContext } from "../UserContext";

// Define the shape of the context state
interface CustomizerContextState {
  updateAppearance: () => Promise<void>;
  activeDir: string;
  setActiveDir: (dir: string) => void;
  activeMode: string;
  setActiveMode: (mode: string) => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  activeLayout: string;
  setActiveLayout: (layout: string) => void;
  isCardShadow: boolean;
  setIsCardShadow: (shadow: boolean) => void;
  isLayout: string;
  setIsLayout: (layout: string) => void;
  isBorderRadius: number;
  setIsBorderRadius: (radius: number) => void;
  isCollapse: string;
  setIsCollapse: (collapse: string) => void;
  isSidebarHover: boolean;
  setIsSidebarHover: (isHover: boolean) => void;
  isMobileSidebar: boolean; // Add this
  setIsMobileSidebar: (isMobileSidebar: boolean) => void;
  loading: boolean;
  error: Error | null;
}

export const CustomizerContext = createContext<CustomizerContextState | any>(undefined);

interface CustomizerContextProps {
  children: ReactNode;
}

export const CustomizerContextProvider: React.FC<CustomizerContextProps> = ({ children }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const lang = Cookies.get("lang") ?? config.isLanguage;
    setIsLanguage(lang);
  }, []);

  const [activeDir, setActiveDir] = useState<string>(config.activeDir);
  const [activeMode, setActiveMode] = useState<string>(config.activeMode);
  const [activeTheme, setActiveTheme] = useState<string>(config.activeTheme);
  const [activeLayout, setActiveLayout] = useState<string>(config.activeLayout);
  const [isCardShadow, setIsCardShadow] = useState<boolean>(config.isCardShadow);
  const [isLayout, setIsLayout] = useState<string>(config.isLayout);
  const [isBorderRadius, setIsBorderRadius] = useState<number>(config.isBorderRadius);
  const [isCollapse, setIsCollapse] = useState<string>(config.isCollapse);
  const [isLanguage, setIsLanguage] = useState<string>(config.isLanguage);
  const [isSidebarHover, setIsSidebarHover] = useState<boolean>(false);
  const [isMobileSidebar, setIsMobileSidebar] = useState<boolean>(false);

  const {
    data: userAppearanceData,
    isLoading: isAppearanceLoading,
    error: appearanceError, 
    mutate: appearanceMutate,
  } = useSWR("/api/user/setting/appearnce", getFetcher);

  useEffect(() => {
    if (userAppearanceData) {
      const appearanceData = userAppearanceData.data || {};
      if (appearanceData.activeMode) setActiveMode(appearanceData.activeMode);
      if (appearanceData.activeTheme) setActiveTheme(appearanceData.activeTheme);
      if (appearanceData.activeLayout) setActiveLayout(appearanceData.activeLayout);
      if (appearanceData.activeDir) setActiveDir(appearanceData.activeDir);
      if (appearanceData.isCardShadow !== undefined) setIsCardShadow(appearanceData.isCardShadow);
      if (appearanceData.isLayout) setIsLayout(appearanceData.isLayout);
      if (appearanceData.isBorderRadius !== undefined) setIsBorderRadius(appearanceData.isBorderRadius);
      if (appearanceData.isCollapse) setIsCollapse(appearanceData.isCollapse);
      if (appearanceData.isLanguage) setIsLanguage(appearanceData.isLanguage);
      if (appearanceData.isSidebarHover !== undefined) setIsSidebarHover(appearanceData.isSidebarHover);
      if (appearanceData.isMobileSidebar !== undefined) setIsMobileSidebar(appearanceData.isMobileSidebar);
      setLoading(isAppearanceLoading);
      if (appearanceError) {
        setError(appearanceError);
        setLoading(isAppearanceLoading);
      }
    }
  }, [userAppearanceData, isAppearanceLoading, appearanceError]);

  useEffect(() => {
    document.documentElement.setAttribute("class", activeMode);
    document.documentElement.setAttribute("dir", activeDir);
    document.documentElement.setAttribute("data-color-theme", activeTheme);
    document.documentElement.setAttribute("data-layout", activeLayout);
    document.documentElement.setAttribute("data-boxed-layout", isLayout);
    document.documentElement.setAttribute("data-sidebar-type", isCollapse);
  }, [activeMode, activeDir, activeTheme, activeLayout, isLayout, isCollapse]);

  type AppearancePayload = {
    activeDir: string;
    activeMode: string;
    activeTheme: string;
    activeLayout: string;
    isCardShadow: boolean;
    isLayout: string;
    isBorderRadius: number;
    isCollapse: string;
    isLanguage: string;
    isSidebarHover: boolean;
    isMobileSidebar: boolean;
  };

  const updateAppearance = async (customPayload?: Partial<AppearancePayload>) => {
    try {
      const payload: AppearancePayload = {
        activeDir,
        activeMode,
        activeTheme,
        activeLayout,
        isCardShadow,
        isLayout,
        isBorderRadius,
        isCollapse,
        isLanguage,
        isSidebarHover,
        isMobileSidebar,
        ...customPayload,
      };
      await appearanceMutate(patchFetcher("/api/user/setting/appearnce", payload));
    } catch (error) {
      console.error("Error updating appearance:", error);
    }
  };

  return (
    <CustomizerContext.Provider
      value={{
        updateAppearance,
        activeDir,
        setActiveDir,
        activeMode,
        setActiveMode,
        activeTheme,
        setActiveTheme,
        activeLayout,
        setActiveLayout,
        isCardShadow,
        setIsCardShadow,
        isLayout,
        setIsLayout,
        isBorderRadius,
        setIsBorderRadius,
        isCollapse,
        setIsCollapse,
        isLanguage,
        setIsLanguage,
        isSidebarHover,
        setIsSidebarHover,
        isMobileSidebar,
        setIsMobileSidebar,

        loading,
        error,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};
