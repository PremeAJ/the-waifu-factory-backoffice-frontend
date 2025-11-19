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
import { useSearchParams } from "next/navigation";
import { parseSearchParamsToFilters } from "./util";

export const ProductsContext = createContext<any>({} as any);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const { showError } = useDialog();
  const searchParams = useSearchParams();
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const endpoint = "/api/product";

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || 10;
  const filters = parseSearchParamsToFilters(searchParams);

  const desktopKey = useMemo(() => {
    if (isMobile) return null;
    return `${endpoint}?${searchParams.toString()}`;
  }, [isMobile, searchParams]); 

  const { data: desktopData, error: desktopError, isLoading: desktopLoading, mutate: desktopMutate } = useSWR(desktopKey, getFetcher, swrOption);

  const getMobileKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile) return null;
    if (previousPageData && previousPageData.data && previousPageData.data.length === 0) return null;

    const params = new URLSearchParams(searchParams);
    params.set("page", String(pageIndex + 1));
    return `${endpoint}?${params.toString()}`;
  };

  const { data: mobilePages, error: mobileError, isLoading: mobileLoading, mutate: mobileMutate, size, setSize, isValidating } = useSWRInfinite(
    getMobileKey,
    getFetcher
  );

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
    ? !mobilePages || (mobilePages[mobilePages.length - 1]?.data?.data?.length ?? 0) < perPage || !!(pageOptions.total && products.length >= pageOptions.total)
    : true;

  const loadMore = () => {
    if (isMobile && !isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
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
    actionLoading,
    error,
    filters,
    isLoadingMore,
    isReachingEnd,
    loading,
    page,
    pageOptions,
    perPage,
    products,
    createProduct,
    deleteProduct,
    getProductById,
    loadMore,
    mutate: productsMutate,
    updateProduct,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
