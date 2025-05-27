"use client";
import React, { createContext, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import { userType } from "./type";

export type UserContextType = {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>; // เพิ่ม setUser
  refreshUser: () => {};
  syncUser: () => {};
  loading: boolean;
  error: Error | null;
};

// สร้าง Context
export const UserContext = createContext<UserContextType>({} as UserContextType);

// ค่าเริ่มต้น
const initialConfig = {
  user: null,
  loading: true,
  error: null,
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State Management
  const [user, setUser] = useState<userType | null>(initialConfig.user);
  const [loading, setLoading] = useState<boolean>(initialConfig.loading);
  const [error, setError] = useState<Error | null>(initialConfig.error);

  // Fetch Data
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
    mutate: userMutate,
  } = useSWR("/api/users/me", getFetcher);

  useEffect(() => {
    if (usersData) {
      setUser(usersData?.data);
      setLoading(isUsersLoading);
    } else if (usersError) {
      setError(usersError);
      setLoading(isUsersLoading);
    }
  }, [usersData, usersError]);
  const refreshUser = async () => {
    await userMutate();
  };
  const syncUser = async () => {
    try {
      await userMutate(postFetcher("/api/users/ensure", {}));
    } catch (error: any) {}
  };
  const value: UserContextType = {
    user,
    setUser,
    refreshUser,
    syncUser,
    loading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
