"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CookiesKey, setCookiesOption1Y } from "@/common/constants/cookies";

interface NsfwContextType {
  showNsfw: boolean;
  toggleNsfw: () => void;
  setShowNsfw: (value: boolean) => void;
}

const NsfwContext = createContext<NsfwContextType>({
  showNsfw: false,
  toggleNsfw: () => {},
  setShowNsfw: () => {},
});

export const NsfwProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showNsfw, setShowNsfwState] = useState(false);

  useEffect(() => {
    setShowNsfwState(Cookies.get(CookiesKey.NSFW_MODE) === "true");
  }, []);

  const setShowNsfw = (value: boolean) => {
    Cookies.set(CookiesKey.NSFW_MODE, String(value), setCookiesOption1Y);
    setShowNsfwState(value);
  };

  const toggleNsfw = () => setShowNsfw(!showNsfw);

  return (
    <NsfwContext.Provider value={{ showNsfw, toggleNsfw, setShowNsfw }}>
      {children}
    </NsfwContext.Provider>
  );
};

export const useNsfw = () => useContext(NsfwContext);
