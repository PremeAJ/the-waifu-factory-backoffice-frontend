"use client";
import {
  CategoriesContextType,
  CategoryDetailType,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryStatus,
  CategoryFilters, // เพิ่ม import
} from "./interfaces/categories";
import { defaultPageOptions } from "@/common/interface/paginate";
import { getFetcher, postFetcher, deleteFetcher, putFetcher } from "@/app/api/globalFetcher";
import { useDialog } from "../DialogContext";
import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { swrOption } from "@/app/api/swrOption";

export const CategoriesContext = createContext<CategoriesContextType>({} as CategoriesContextType);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [filters, setFiltersState] = useState<CategoryFilters>({
    search: "",
    status: "all",
  });
  const { showError } = useDialog();
  const endpoint = "/api/categories";
  const masterIconEndpoint = "/api/master/icon/category";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const setFilters = (newFilters: Partial<CategoryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    // Reset page if search term changes
    if (newFilters.search !== undefined && newFilters.search !== filters.search) {
      setPage(1);
    }
    setFiltersState(updatedFilters);
  };

  const categoriesUrl = useMemo(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("perPage", perPage.toString());
    if (debouncedSearch && debouncedSearch.trim()) {
      queryParams.set("search", debouncedSearch.trim());
    }
    // เพิ่ม status เข้า query param เฉพาะเมื่อไม่ใช่ 'all'
    if (filters.status && filters.status !== "all") {
      queryParams.set("status", filters.status);
    }

    return `${endpoint}?${queryParams.toString()}`;
  }, [page, perPage, debouncedSearch, filters.status]);

  const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading, mutate: categoriesMutate } = useSWR(categoriesUrl, getFetcher);

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
    loading: categoriesLoading || isLoading,
    categories: categoriesData?.data?.data || [],
    categoryIcons: categoryIconsData?.data || [],
    pageOptions: categoriesData?.data?.pageOptions || defaultPageOptions,
    error: categoriesError || dropdownError || categoryIconsError || null,
  };

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export const useCategories = () => useContext(CategoriesContext);
