"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import useSWR from "swr";
import { getFetcher } from "@/app/api/globalFetcher";

export interface ProvinceType {
  id: number;
  nameTh: string;
  nameEn?: string;
}
export interface DistrictType {
  id: number;
  name: string;
  provinceId: number;
}
export interface SubdistrictType {
  id: number;
  name: string;
  districtId: number;
}
export interface ZipcodeType {
  id: number;
  zipcode: number;
  subdistrictId: number;
}

interface AddressContextProps {
  provinces: ProvinceType[];
  districts: DistrictType[];
  subdistricts: SubdistrictType[];
  zipcode: ZipcodeType[];
  selectedProvinceId: number | null;
  selectedDistrictId: number | null;
  selectedSubdistrictId: number | null;
  setProvinceId: (id: number | null) => void;
  setDistrictId: (id: number | null) => void;
  setSubdistrictId: (id: number | null) => void;
  isLoading: boolean;
  error: string;
}

export const AddressContext = createContext<AddressContextProps>({
  provinces: [],
  districts: [],
  subdistricts: [],
  zipcode: [],
  selectedProvinceId: null,
  selectedDistrictId: null,
  selectedSubdistrictId: null,
  setProvinceId: () => {},
  setDistrictId: () => {},
  setSubdistrictId: () => {},
  isLoading: false,
  error: "",
});

export const AddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProvinceId, setProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setDistrictId] = useState<number | null>(null);
  const [selectedSubdistrictId, setSubdistrictId] = useState<number | null>(null);

  const { data: provincesData, isLoading: loadingProvinces, error: errorProvinces } = useSWR("/api/master/address/provinces", getFetcher);

  const {
    data: districtsData,
    isLoading: loadingDistricts,
    error: errorDistricts,
  } = useSWR(selectedProvinceId ? ["/api/master/address/districts", { provinceId: selectedProvinceId }] : null, getFetcher);

  const {
    data: subdistrictsData,
    isLoading: loadingSubdistricts,
    error: errorSubdistricts,
  } = useSWR(selectedDistrictId ? [`/api/master/address/subdistricts`, { districtId: selectedDistrictId }] : null, getFetcher);

  const {
    data: zipcodeData,
    isLoading: loadingZipcode,
    error: errorZipcode,
  } = useSWR(selectedSubdistrictId ? [`/api/master/address/zipcodes`, { subdistrictId: selectedSubdistrictId }] : null, getFetcher);

  return (
    <AddressContext.Provider
      value={{
        provinces: provincesData?.data || [],
        districts: districtsData?.data || [],
        zipcode: zipcodeData?.data || [],
        subdistricts: subdistrictsData?.data || [],
        selectedProvinceId,
        selectedDistrictId,
        selectedSubdistrictId,
        setProvinceId: (id) => {
          setProvinceId(id);
          setDistrictId(null);
          setSubdistrictId(null);
        },
        setDistrictId: (id) => {
          setDistrictId(id);
          setSubdistrictId(null);
        },
        setSubdistrictId,
        isLoading: loadingProvinces || loadingDistricts || loadingSubdistricts || loadingZipcode,
        error: errorProvinces?.message || errorDistricts?.message || errorSubdistricts?.message || errorZipcode?.message || "",
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
