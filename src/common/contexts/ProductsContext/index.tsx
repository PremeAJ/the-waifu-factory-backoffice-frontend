"use client";
import { defaultPageOptions, PageOptions } from "@/common/interface/paginate";
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from "@/app/api/globalFetcher";
import { useDialog } from "../DialogContext";
import React, { createContext, useContext, useMemo, useState } from "react";
import type { CreateProductPayload, ProductFilters, ProductType, UpdateProductPayload } from "./interfaces/products";
import useIsMobile from "@/common/utils/state/isMobile";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { swrOption } from "@/app/api/swrOption";

export const ProductsContext = createContext<any>({} as any);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const { showError } = useDialog();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(20);
  const [filters, setFilters] = useState<ProductFilters>({ search: "", status: "all" });
  const [actionLoading, setActionLoading] = useState<boolean>(false);

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

  const { data: desktopData, error: desktopError, isLoading: desktopLoading, mutate: desktopMutate } = useSWR(desktopKey, getFetcher, swrOption);

  const getMobileKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile) return null;
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

  const getProductById = async (id: string): Promise<ProductType | null> => {
    try {
      const response = await getFetcher(`${endpoint}/${id}`);
      if (response.error) {
        showError({ message: response?.message });
      }
      return response?.data ?? null;
    } catch (err) {
      return null;
    }
  };

  // ✅ แปลง payload ก่อนส่ง API - ลบ thumbnailImageUrl และ thumbnailOriginName
  const cleanPayloadForApi = (payload: CreateProductPayload | UpdateProductPayload) => {
    return {
      ...payload,
      productOptions: payload.productOptions?.map((opt: any) => {
        const { thumbnailImageUrl, thumbnailOriginName, ...rest } = opt;
        return rest;
      }),
    };
  };

  const createProduct = async (payload: CreateProductPayload) => {
    try {
      setActionLoading(true);
      const cleanedPayload = cleanPayloadForApi(payload);
      console.log('Create payload:', cleanedPayload); // ✅ Debug log
      const response = await postFetcher(endpoint, cleanedPayload);
      if (response.error) {
        showError({ message: response?.message });
      }
      await productsMutate();
      return response;
    } catch (error: any) {
      showError({ message: error?.message });
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const updateProduct = async (id: string, payload: UpdateProductPayload) => {
    try {
      setActionLoading(true);
      const cleanedPayload = cleanPayloadForApi(payload);
      console.log('Update payload:', cleanedPayload); // ✅ Debug log
      const response = await putFetcher(`${endpoint}/${id}`, cleanedPayload);
      if (response.error) {
        showError({ message: response?.message });
      }
      await productsMutate();
      return response;
    } catch (error: any) {
      showError({ message: error?.message });
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setActionLoading(true);
      const res = await deleteFetcher(`${endpoint}/${id}`, {});
      await productsMutate();
      return res;
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
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
    actionLoading,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    mutate: productsMutate,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
