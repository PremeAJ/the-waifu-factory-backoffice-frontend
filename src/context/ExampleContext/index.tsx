"use client";
import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";

// 1. กำหนด type ของ resource
export interface ExampleType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

// 2. กำหนด type ของ context
export interface ExampleContextProps {
  items: ExampleType[];
  isLoading: boolean;
  error: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
  mutateItems: () => void;
}

// 3. สร้าง context พร้อม default value
export const ExampleContext = createContext<ExampleContextProps>({
  items: [],
  isLoading: true,
  error: "",
  setLoading: () => {},
  setError: () => {},
  mutateItems: () => {},
});

// 4. Provider
export const ExampleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ExampleType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ใช้ SWR ดึงข้อมูล
  const { data, isLoading: swrLoading, error: swrError, mutate } = useSWR("/api/example", getFetcher);

  useEffect(() => {
    if (data) {
      setItems(data);
      setLoading(swrLoading);
    } else if (swrError) {
      setError(swrError);
      setLoading(swrLoading);
      console.log("Failed to fetch the data");
    } else {
      setLoading(swrLoading);
    }
  }, [data, swrError, swrLoading]);

  const value: ExampleContextProps = {
    items,
    isLoading,
    error,
    setLoading,
    setError,
    mutateItems: mutate,
  };

  return <ExampleContext.Provider value={value}>{children}</ExampleContext.Provider>;
};