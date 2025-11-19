"use client";
import { defaultPageOptions, PageOptions } from "@/common/interface/paginate";
import { defaultSWROption, swrOption } from "@/app/api/swrOption";
import { getFetcher } from "@/app/api/globalFetcher";
import { parseSearchParamsToMenuFilters } from "./util";
import { useSearchParams } from "next/navigation";
import React, { createContext, useContext, useMemo, FC, ReactNode } from "react";
import type { MenuItem } from "./interfaces/menu";
import useIsMobile from "@/common/utils/state/isMobile";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export const CasheirContext = createContext<any>({} as any);

export const CasheirProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  const endpoint = "/api/cashier";
  const perPage = Number(searchParams.get("perPage")) || 10;
  const filters = parseSearchParamsToMenuFilters(searchParams);

  const desktopKey = useMemo(() => {
    if (isMobile) return null;
    return `${endpoint}/menu-list?${searchParams.toString()}`;
  }, [isMobile, searchParams]);

  const { data: desktopData, error: desktopError, isLoading: desktopLoading, mutate: desktopMutate } = useSWR(desktopKey, getFetcher, defaultSWROption);

  const getMobileKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile) return null;
    // ตรวจสอบ .data.data เหมือน ProductsContext
    if (previousPageData && !previousPageData?.data?.data) return null;
    if (previousPageData && previousPageData.data.data.length < perPage) return null;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageIndex + 1));
    return `${endpoint}/menu-list?${params.toString()}`;
  };

  const { data: mobilePages, error: mobileError, isLoading: mobileLoading, mutate: mobileMutate, size, setSize, isValidating } = useSWRInfinite(
    getMobileKey,
    getFetcher,
    swrOption
  );

  const menus = useMemo(() => {
    if (isMobile) return mobilePages?.flatMap((p: any) => p.data?.data ?? []) ?? [];
    return desktopData?.data?.data ?? [];
  }, [isMobile, mobilePages, desktopData]);

  const pageOptions: PageOptions = useMemo(() => {
    if (isMobile) {
      const last = mobilePages?.[mobilePages.length - 1]?.data;
      return last?.pageOptions ?? defaultPageOptions;
    }
    return desktopData?.data?.pageOptions ?? defaultPageOptions;
  }, [isMobile, mobilePages, desktopData]);

  const loading = isMobile ? mobileLoading : desktopLoading;
  const error = isMobile ? mobileError : desktopError;
  const menusMutate = isMobile ? mobileMutate : desktopMutate;

  const isLoadingMore = isMobile ? mobileLoading || (isValidating && (mobilePages?.length ?? 0) > 0) : false;

  const isReachingEnd = useMemo(() => {
    if (!isMobile) return true;
    if (!mobilePages || mobilePages.length === 0) return false;
    const last = mobilePages[mobilePages.length - 1];
    const lastItems = last?.data?.length ?? 0;
    const totalLoaded = menus.length;
    const grandTotal = last?.pageOptions?.total ?? 0;
    return lastItems < perPage || totalLoaded >= grandTotal;
  }, [isMobile, mobilePages, menus, perPage]);

  const loadMore = () => {
    if (isMobile && !isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  const getMenuById = async (id: string): Promise<MenuItem | null> => {
    try {
      const response = await getFetcher(`${endpoint}/${id}`);
      return response?.data ?? null;
    } catch {
      return null;
    }
  };

  const value = {
    menus,
    filters,
    perPage,
    pageOptions,
    loading,
    error,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    mutate: menusMutate,
    getMenuById,
  };

  return <CasheirContext.Provider value={value}>{children}</CasheirContext.Provider>;
};

export const useCasheir = () => useContext(CasheirContext);