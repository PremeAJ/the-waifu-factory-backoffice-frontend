"use client";
import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction, useContext } from "react";
import React from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";

export interface PlanType {
  id: string;
  name: string;
  descriptionTh: string;
  price: string;
  periodDays: number | null;
  isTrial: boolean;
  features: Record<string, boolean>;
  sort: number;
  isPopular: boolean;
  isActive: boolean;
  descriptionEn: string | null;
}

export interface PlanContextProps {
  plan: PlanType[];
  isLoading: boolean;
  error: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
  PlanMutate: () => void;
}
export const PlanContext = createContext<PlanContextProps>({
  plan: [],
  isLoading: true,
  error: "",
  setLoading: () => {},
  setError: () => {},
  PlanMutate: () => {},
});

export const PlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plan, setPlan] = useState<PlanType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const {
    data: PlanData,
    isLoading: isPlanLoading,
    error: PlanError,
    mutate: PlanMutate,
  } = useSWR("/api/master/plan", getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });

  useEffect(() => {
    if (PlanData) {
      setPlan(PlanData.data);
      setLoading(isPlanLoading);
    } else if (PlanError) {
      setError(PlanError.message);
      setLoading(isPlanLoading);
      console.log("Failed to fetch the data");
    } else {
      setLoading(isPlanLoading);
    }
  }, [PlanData, PlanError, isPlanLoading]);

  const value: PlanContextProps = {
    plan,
    isLoading,
    error,
    setError,
    setLoading,
    PlanMutate,
  };
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export const usePlan = () => useContext(PlanContext);
