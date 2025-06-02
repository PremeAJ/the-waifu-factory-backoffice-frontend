"use client";
import React, { createContext, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { getFetcher, patchFetcher, postFetcher } from "@/app/api/globalFetcher";
import { userType } from "./type";
import { supabaseUploadFile, UploadFileType } from "@/utils/supabase/server";
import reduceImageFileSize from "@/utils/function/file/reduceImageFileSize";

export type UserContextType = {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>; // เพิ่ม setUser
  syncUser: () => {};
  uploadAvatar: (file: File | Blob | ArrayBuffer | string) => {};
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

  const syncUser = async () => {
    try {
      await userMutate(postFetcher("/api/users/ensure", {}));
    } catch (error: any) {}
  };

  async function uploadAvatar(file: File | Blob | ArrayBuffer | string) {
    file = await reduceImageFileSize(file, 800 * 1024);
    const payload: UploadFileType = {
      file,
      bucket: "avatars",
      path: `users/${user?.id}/avatar`,
      ext: "png",
      contentType: "image/png",
    };
    const newAvatarUrl = await supabaseUploadFile(payload);
    await userMutate(patchFetcher("/api/users/avatar", { avatarUrl: newAvatarUrl }));
    return null;
  }
  const value: UserContextType = {
    user,
    error,
    loading,
    setUser,
    syncUser,
    uploadAvatar,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
