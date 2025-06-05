"use client";
import React, { createContext, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { getFetcher, patchFetcher, postFetcher } from "@/app/api/globalFetcher";
import { SettingProfile, userType } from "./type";
import { supabaseUpdateEmail, supabaseUploadFile, UploadFileType, supabaseUpdatePhone, supabaseVerifyOtp } from "@/utils/supabase/server";
import reduceImageFileSize from "@/utils/function/file/reduceImageFileSize";
import { VerifyOtpParams } from "@supabase/supabase-js";

export type UserContextType = {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>; // เพิ่ม setUser
  syncUser: () => {};
  updateUser: (payload: SettingProfile) => {};
  uploadAvatar: (file: File | Blob | ArrayBuffer | string) => {};
  checkExistEmail: (email: string) => Promise<boolean>;
  updateUserEmail: (newEmail: string) => Promise<any>;
  loading: boolean;
  error: Error | null;
  updateUserPhone: (newPhone: string) => Promise<any>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<any>;
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
  const { data: usersData, isLoading: isUsersLoading, error: usersError, mutate: userMutate } = useSWR("/api/users/me", getFetcher);

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
    try {
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
    } catch (error) {}
  }

  async function updateUser(payload: SettingProfile) {
    try {
      await userMutate(patchFetcher("/api/users/me", payload));
    } catch (error: any) {
      return error.message;
    }
  }

  async function updateUserEmail(newEmail: string) {
    const response = await supabaseUpdateEmail(newEmail);
    return response;
  }

  async function checkExistEmail(email: string) {
    try {
      // เพิ่มการ encode email ก่อนส่งไป API
      const encodedEmail = encodeURIComponent(email);
      const response = await getFetcher(`/api/users/email/${encodedEmail}/exists`);
      return response.data.exists;
    } catch (error: any) {
      setError(error);
      return false;
    }
  }

  async function updateUserPhone(newPhone: string) {
    const response = await supabaseUpdatePhone(newPhone);
    return response;
  }

  async function verifyPhoneOtp(phone: string, token: string) {
    const payload: VerifyOtpParams = { phone, token, type: "phone_change" };
    const response = await supabaseVerifyOtp(payload);
    if (!response.error) {
      await userMutate();
    }
    return response;
  }

  const value: UserContextType = {
    user,
    error,
    loading,
    setUser,
    syncUser,
    updateUser,
    uploadAvatar,
    verifyPhoneOtp,
    checkExistEmail,
    updateUserEmail,
    updateUserPhone,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
