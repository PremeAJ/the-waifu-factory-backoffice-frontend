"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ---- Types ----

export interface UserPaymentMethod {
  name: string;
  iconUrl: string;
  accountValue: string;
}

export interface UserSocialMedia {
  name: string;
  iconUrl: string;
  url: string;
}

export interface WaifuUser {
  id: string;
  discordId: string;
  username: string;
  displayName: string;
  profilePictureUrl: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  createdAt: string;
  paymentMethods: UserPaymentMethod[];
  socialMedias: UserSocialMedia[];
}

// ---- Context ----

interface WaifuUserContextType {
  user: WaifuUser | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
  signOut: () => Promise<void>;
}

const WaifuUserContext = createContext<WaifuUserContextType>({} as WaifuUserContextType);

export const WaifuUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WaifuUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include", headers: { "ngrok-skip-browser-warning": "true" } });
      if (res.ok) {
        const json = await res.json();
        console.log("🚀 ~ WaifuUserProvider ~ json:", json)
        setUser(json.data ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include", headers: { "ngrok-skip-browser-warning": "true" } });
    } finally {
      setUser(null);
    }
  };

  return (
    <WaifuUserContext.Provider value={{ user, isLoading, refetch: fetchMe, signOut }}>
      {children}
    </WaifuUserContext.Provider>
  );
};

export const useWaifuUser = () => useContext(WaifuUserContext);
