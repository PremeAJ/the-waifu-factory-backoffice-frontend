"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from "@/app/api/globalFetcher";
import { defaultPageOptions, PageOptions } from "@/common/interface/paginate";
import type { ProductFilters } from "./interfaces/products";

export const ProductsContext = createContext<any>({} as any);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(20);
  const [filters, setFilters] = useState<ProductFilters>({ search: "", status: "all" });

  const endpoint = "/api/product";

  const setFiltersState = (newFilters: Partial<ProductFilters>) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const desktopKey = useMemo(() => {
    if (isMobile) return null;
    const qp = new URLSearchParams();
    qp.set("page", String(page));
    qp.set("perPage", String(perPage));
    if (filters.search) qp.set("search", filters.search);
    if (filters.status && filters.status !== "all") qp.set("status", filters.status);
    return `${endpoint}?${qp.toString()}`;
  }, [isMobile, page, perPage, filters]);

  const { data: desktopData, error: desktopError, isLoading: desktopLoading, mutate: desktopMutate } = useSWR(desktopKey, getFetcher);

  const getMobileKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile) return null;
    // stop if previous page returned empty data
    if (previousPageData && previousPageData.data && previousPageData.data.length === 0) return null;
    const qp = new URLSearchParams();
    qp.set("page", String(pageIndex + 1));
    qp.set("perPage", String(perPage));
    if (filters.search) qp.set("search", filters.search);
    if (filters.status && filters.status !== "all") qp.set("status", filters.status);
    return `${endpoint}?${qp.toString()}`;
  };

  const {
    data: mobilePages,
    error: mobileError,
    isLoading: mobileLoading,
    mutate: mobileMutate,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(getMobileKey, getFetcher);

  const products = useMemo(() => {
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
  const productsMutate = isMobile ? mobileMutate : desktopMutate;

  const isLoadingMore = isMobile ? mobileLoading || (isValidating && (mobilePages?.length ?? 0) > 0) : false;
  const isReachingEnd = isMobile
    ? !mobilePages ||
      (mobilePages[mobilePages.length - 1]?.data?.data?.length ?? 0) < perPage ||
      !!(pageOptions.total && products.length >= pageOptions.total)
    : true;

  const loadMore = () => {
    if (isMobile && !isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    } else if (!isMobile) {
      setPage((p) => p + 1);
    }
  };

  const getProductById = async (id: string) => {
    try {
      const res = await getFetcher(`${endpoint}/${id}`);
      return res?.data ?? null;
    } catch (err) {
      console.error("getProductById error", err);
      return null;
    }
  };

  const createProduct = async (payload: any) => {
    try {
      const res = await postFetcher(endpoint, payload);
      await productsMutate();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id: string, payload: any) => {
    try {
      const res = await putFetcher(`${endpoint}/${id}`, payload);
      await productsMutate();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await deleteFetcher(`${endpoint}/${id}`, {});
      await productsMutate();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const value = {
    products,
    pageOptions,
    page,
    perPage,
    setPage,
    setPerPage,
    filters,
    setFilters: setFiltersState,
    loadMore,
    isLoadingMore,
    isReachingEnd,
    loading,
    error,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    mutate: productsMutate,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
