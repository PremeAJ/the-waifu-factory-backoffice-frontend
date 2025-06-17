"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import useSWR from "swr";
import { getFetcher, patchFetcher, postFetcher } from "@/app/api/globalFetcher";
import { supabaseUpdateEmail, supabaseUploadFile, UploadFileType, supabaseUpdatePhone, supabaseVerifyOtp } from "@/utils/supabase/server";
import reduceImageFileSize from "@/utils/function/file/reduceImageFileSize";
import { VerifyOtpParams } from "@supabase/supabase-js";
import { AuthContext } from "../AuthContext";

export interface userType {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  email: string;
  phone: string | null;
  role: string | null;
  permissionId: string | null;
  companyId: string | null;
  activeCompanyId: string | null;
  hasReceivedTrial: string | null
  users: {
    email: string;
    phone: string | null;
  };
}
export interface SettingProfile {
  firstName?: string;
  lastName?: string;
  nickName?: string;
  email?: string;
  phone?: string;
}

export type UserContextType = {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>; 
  syncUser: () => {};
  updateUser: (payload: SettingProfile) => {};
  uploadAvatar: (file: File | Blob | ArrayBuffer | string) => {};
  checkExistEmail: (email: string) => Promise<boolean>;
  updateUserEmail: (newEmail: string) => Promise<any>;
  userMutate: () => Promise<any>;
  loading: boolean;
  error: Error | null;
  updateUserPhone: (newPhone: string) => Promise<any>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<any>;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);

const initialConfig = {
  user: null,
  loading: true,
  error: null,
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<userType | null>(initialConfig.user);
  const [loading, setLoading] = useState<boolean>(initialConfig.loading);
  const [error, setError] = useState<Error | null>(initialConfig.error);
  const { user: session, isLoading: authIsLoading } = useContext(AuthContext);

  const { data: usersData, isLoading: isUsersLoading, error: usersError, mutate: userMutate, } = useSWR(session && !authIsLoading ? "/api/users/me" : null, getFetcher, {
    refreshInterval: 60000, // รีเฟรชทุก 60 วินาที
    // revalidateOnFocus: false, // ไม่ revalidate เมื่อ focus
    // revalidateOnReconnect: false, // ไม่ revalidate เมื่อ reconnect
  });
  useEffect(() => {
    if (!session && !authIsLoading) {
      setLoading(false);
    }
    if (usersData) {
      setUser(usersData?.data);
      setLoading(isUsersLoading);
    } else if (usersError) {
      setError(usersError);
      setLoading(isUsersLoading);
    }
  }, [session, usersData, usersError, isUsersLoading, authIsLoading]);

  const syncUser = async () => {
    try {
      await postFetcher("/api/users/ensure", {}); // รอสร้าง user เสร็จจริง
      await userMutate(); // fetch /api/users/me ใหม่หลังจากนั้น
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
    userMutate,
    uploadAvatar,
    verifyPhoneOtp,
    checkExistEmail,
    updateUserEmail,
    updateUserPhone,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
