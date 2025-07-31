"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import useSWR from "swr";
import { getFetcher, patchFetcher, postFetcher } from "@/app/api/globalFetcher";
import { supabaseUpdateEmail, supabaseUploadFile, UploadFileType, supabaseUpdatePhone, supabaseVerifyOtp } from "@/common/utils/supabase/server";
import reduceImageFileSize from "@/common/utils/function/file/reduceImageFileSize";
import { VerifyOtpParams } from "@supabase/supabase-js";
import { AuthContext } from "../AuthContext";
import { useRouter } from "next/navigation";

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
  hasReceivedTrial: string | null;
  users: {
    email: string;
    phone: string | null;
  };
  companies: {
    id: string;
    name: string;
    logoUrl: string | null;
    businessTypeId: number;
    companyUsers: {
      roles: {
        nameTh: string;
        nameEn: string;
      };
      branches: {
        nameTh: string;
        nameEn: string;
      };
    }[];
  };
}
export interface SettingProfile {
  firstName?: string;
  lastName?: string;
  nickName?: string;
  email?: string;
  phone?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
  businessTypeId: number;
}

export interface Role {
  nameTh: string;
  nameEn: string;
}

export interface CompanyListItem {
  companies: Company;
  roles: Role;
}

export type UserContextType = {
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  syncUser: () => {};
  updateUser: (payload: SettingProfile) => {};
  userMutate: () => Promise<any>;
  companyListMutate: () => Promise<any>;
  uploadAvatar: (file: File | Blob | ArrayBuffer | string) => {};
  verifyPhoneOtp: (phone: string, token: string) => Promise<any>;
  updateUserPhone: (newPhone: string) => Promise<any>;
  checkExistEmail: (email: string) => Promise<boolean>;
  updateUserEmail: (newEmail: string) => Promise<any>;
  setActiveCompany: (companyId: string) => Promise<any>;
  user: userType | null;
  error: Error | null;
  loading: boolean;
  companyList: CompanyListItem[];
  companyListError: Error | null;
  companyListLoading: boolean;
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

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
    mutate: userMutate,
  } = useSWR(session && !authIsLoading ? "/api/users/me" : null, getFetcher, {});
  const {
    data: companyListData,
    isLoading: companyListLoading,
    error: companyListError,
    mutate: companyListMutate,
  } = useSWR(session && !authIsLoading ? "/api/users/me/company-list" : null, getFetcher, {});

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
      await postFetcher("/api/users/ensure", {});
      await userMutate();
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

  const setActiveCompany = async (companyId: string) => {
    try {
      setLoading(true);
      await patchFetcher("/api/users/me/active-company", { companyId });
      await userMutate();
      await companyListMutate();
      setLoading(false);
    } catch (error: any) {}
  };

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
    setActiveCompany,
    companyListMutate,
    companyListError,
    companyListLoading,
    companyList: companyListData?.data || [],
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
