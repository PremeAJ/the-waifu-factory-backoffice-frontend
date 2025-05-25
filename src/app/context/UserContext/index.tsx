"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

import { getFetcher, postFetcher } from "@/app/api/globalFetcher";
import useSWR from "swr";
import { UserContextType, userType } from "./type";

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

const config = {
  user: null,
  loading: true,
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<userType | null>(config.user);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(config.loading);

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useSWR("/api/users/me", getFetcher);

  useEffect(() => {
    if (usersData) {
      setUser(usersData);
      setLoading(isUsersLoading);
    } else if (usersError) {
      setError(usersError);
      setLoading(isUsersLoading);
    }
  }, [usersData, isUsersLoading, usersError]);

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
