"use client";
import {
  CategoriesContextType,
  CategoryDetailType,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilters,
} from "./interfaces/categories";
import { defaultPageOptions, PageOptions } from "@/common/interface/paginate";
import { getFetcher, postFetcher, deleteFetcher, putFetcher } from "@/app/api/globalFetcher";
import { swrOption } from "@/app/api/swrOption";
import { useDialog } from "../DialogContext";
import config from "../setting/config";
import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export const CategoriesContext = createContext<CategoriesContextType>({} as CategoriesContextType);
export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(config.defaultPage);
  const [perPage, setPerPage] = useState(config.defaultPerPage);
  const [filters, setFiltersState] = useState<CategoryFilters>({
    search: "",
    status: "all",
  });
  const { showError } = useDialog();
  const endpoint = "/api/categories";
  const masterIconEndpoint = "/api/master/icon/category";

  const setFilters = (newFilters: Partial<CategoryFilters>) => {
    setPage(1); 
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const desktopKey = useMemo(() => {
    if (isMobile) return null; 
    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("perPage", perPage.toString());
    if (filters.search) queryParams.set("search", filters.search);
    if (filters.status !== "all") queryParams.set("status", filters.status);
    return `${endpoint}?${queryParams.toString()}`;
  }, [isMobile, page, perPage, filters]);

  const { data: desktopData, error: desktopError, isLoading: desktopLoading, mutate: desktopMutate } = useSWR(desktopKey, getFetcher);

  const getMobileKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile || (previousPageData && !previousPageData.data.data.length)) return null; // ไม่ทำงานถ้าเป็น Desktop หรือถึงหน้าสุดท้าย
    const queryParams = new URLSearchParams();
    queryParams.set("page", (pageIndex + 1).toString());
    queryParams.set("perPage", perPage.toString());
    if (filters.search) queryParams.set("search", filters.search);
    if (filters.status !== "all") queryParams.set("status", filters.status);
    return `${endpoint}?${queryParams.toString()}`;
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

  const categories = useMemo(() => {
    return isMobile ? mobilePages?.flatMap((p) => p.data.data) ?? [] : desktopData?.data?.data ?? [];
  }, [isMobile, mobilePages, desktopData]);

  const pageOptions: PageOptions = useMemo(() => {
    const source = isMobile ? mobilePages?.[mobilePages.length - 1]?.data : desktopData?.data;
    return source?.pageOptions ?? defaultPageOptions;
  }, [isMobile, mobilePages, desktopData]);

  const loading = isMobile ? mobileLoading : desktopLoading;
  const error = isMobile ? mobileError : desktopError;
  const categoriesMutate = isMobile ? mobileMutate : desktopMutate;

  const isLoadingMore = isMobile ? mobileLoading || (isValidating && (mobilePages?.length ?? 0) > 0) : false;
  const isReachingEnd = isMobile
    ? !mobilePages ||
      (mobilePages[mobilePages.length - 1]?.data.data.length ?? 0) < perPage ||
      !!(pageOptions.total && categories.length >= pageOptions.total) 
    : true;

  const loadMore = () => {
    if (isMobile && !isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  // ... (ส่วนของ dropdown, create, update, delete ยังคงเหมือนเดิม) ...
  const {
    data: dropdownData,
    error: dropdownError,
    mutate: dropdownMutate,
    isLoading: dropdownLoading,
  } = useSWR(`${endpoint}/dropdown`, getFetcher, swrOption);

  const {
    data: categoryIconsData,
    error: categoryIconsError,
    mutate: categoryIconsMutate,
    isLoading: categoryIconsLoading,
  } = useSWR(masterIconEndpoint, getFetcher, swrOption);

  const getCategoryById = async (id: string): Promise<CategoryDetailType> => {
    try {
      const response = await getFetcher(`${endpoint}/${id}`);
      return response.data;
    } catch (err: any) {
      showError({ message: err, title: "Failed to fetch category" });
      throw err;
    }
  };

  const createCategory = async (payload: CreateCategoryDto) => {
    try {
      setIsLoading(true);
      await postFetcher(endpoint, payload);
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      showError({ message: err, title: "Failed to create category" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, payload: UpdateCategoryDto) => {
    try {
      setIsLoading(true);
      await putFetcher(`${endpoint}/${id}`, payload);
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      showError({ message: err, title: "Failed to update category" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteFetcher(`${endpoint}/${id}`, {});
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      showError({ message: err, title: "Failed to delete category" });
    } finally {
      setIsLoading(false);
    }
  };

  const value: CategoriesContextType = {
    filters,
    setFilters,
    setPage,
    setPerPage,
    createCategory,
    deleteCategory,
    dropdownMutate,
    updateCategory,
    getCategoryById,
    categoriesMutate,
    categoryIconsMutate,
    categoryIconsLoading,
    dropdown: dropdownData?.data || [],
    loading: loading || isLoading,
    categories: categories,
    categoryIcons: categoryIconsData?.data || [],
    pageOptions: pageOptions,
    error: error || dropdownError || categoryIconsError || null,
    loadMore,
    isLoadingMore,
    isReachingEnd,
  };

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export const useCategories = () => useContext(CategoriesContext);
