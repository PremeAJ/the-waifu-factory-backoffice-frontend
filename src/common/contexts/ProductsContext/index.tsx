"use client";
import { CreateProductPayload, ProductType, UpdateProductPayload } from "./interfaces/products";
import { defaultPageOptions, PageOptions } from "@/common/interface/paginate";
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from "@/app/api/globalFetcher";
import { parseSearchParamsToFilters } from "./util";
import { defaultSWROption } from "@/app/api/swrOption";
import { useDialog } from "../DialogContext";
import { useSearchParams } from "next/navigation";
import { createContext, FC, ReactNode, useContext, useMemo, useState } from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export const ProductsContext = createContext<any>({} as any);
export const ProductsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const { showError } = useDialog();
  const searchParams = useSearchParams();
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const endpoint = "/api/product";

  const perPage = Number(searchParams.get("perPage")) || 10;
  const filters = parseSearchParamsToFilters(searchParams);

  const desktopKey = useMemo(() => {
    if (isMobile) return null;
    return `${endpoint}?${searchParams.toString()}`;
  }, [isMobile, searchParams]); 

  const { data: desktopData, error: desktopError, isLoading: desktopLoading, mutate: desktopMutate } = useSWR(desktopKey, getFetcher, defaultSWROption);

  const getMobileKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile) return null;
    // ✅ แก้ไข: ตรวจสอบความยาว data ไม่ใช่ data.data
    if (previousPageData && !previousPageData?.data?.data) return null;
    if (previousPageData && previousPageData.data.data.length < perPage) return null; // ✅ ถ้า items < perPage = หมดแล้ว

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
  
  // ✅ แก้ไข logic isReachingEnd
  const isReachingEnd = useMemo(() => {
    if (!isMobile) return true; // Desktop ไม่ต้อง infinite scroll
    
    if (!mobilePages || mobilePages.length === 0) return false; // ยังไม่มี data
    
    const lastPage = mobilePages[mobilePages.length - 1]?.data;
    if (!lastPage) return false;
    
    const lastPageItems = lastPage.data?.length ?? 0;
    const totalLoaded = products.length;
    const grandTotal = lastPage.pageOptions?.total ?? 0;
    
    // ✅ จบเมื่อ: items ที่ได้น้อยกว่า perPage หรือ loaded ครบทั้งหมด
    return lastPageItems < perPage || totalLoaded >= grandTotal;
  }, [isMobile, mobilePages, products, perPage]);

  const loadMore = () => {
    if (isMobile && !isLoadingMore && !isReachingEnd) {
      setSize(size + 1); // ✅ เพิ่ม page ไป 1
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

  // ✅ เพิ่ม activeFilterCount ใน Context
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== "all") count++;
    if (filters.categoryId) count++;
    if (filters.minPrice !== undefined && filters.minPrice !== null) count++;
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) count++;
    if (filters.stockMin !== undefined && filters.stockMin !== null) count++;
    if (filters.stockMax !== undefined && filters.stockMax !== null) count++;
    if (filters.isLowStock) count++;
    return count;
  }, [filters]);

  const value = {
    actionLoading,
    activeFilterCount,    // ✅ เพิ่มเข้า value
    error,
    filters,
    isLoadingMore,
    isReachingEnd,
    loading,
    pageOptions,
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
