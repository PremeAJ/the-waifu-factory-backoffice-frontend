"use client";

import useSWR from "swr";
import { useError } from "@/common/contexts/ErrorContext";
import { defaultPageOptions } from "@/common/interface/paginate";
import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { getFetcher, postFetcher, patchFetcher, deleteFetcher } from "@/app/api/globalFetcher";
import { CategoriesContextType, CategoryDetailType, CreateCategoryDto, UpdateCategoryDto } from "./interfaces/categories";

export const CategoriesContext = createContext<CategoriesContextType>({} as CategoriesContextType);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const endpoint = "/api/categories";
  const masterIconEndpoint = "/api/master/icon/category";
  const { showError } = useError();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
      if (search !== debouncedSearch) {
        setPage(1);
      }
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [search]);

  const categoriesUrl = useMemo(() => {
    const queryParams = new URLSearchParams();
    queryParams.set('page', page.toString());
    queryParams.set('perPage', perPage.toString());
    if (debouncedSearch && debouncedSearch.trim()) {
      queryParams.set('search', debouncedSearch.trim());
    }
    if (isActive !== null) {
      queryParams.set('isActive', isActive.toString());
    }
    
    return `${endpoint}?${queryParams.toString()}`;
  }, [page, perPage, debouncedSearch, isActive]);

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
    mutate: categoriesMutate,
  } = useSWR(categoriesUrl, getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 2000, 
  });

  const {
    data: dropdownData,
    error: dropdownError,
    mutate: dropdownMutate,
    isLoading: dropdownLoading,
  } = useSWR(`${endpoint}/dropdown`, getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, 
  });

  const {
    data: categoryIconsData,
    error: categoryIconsError,
    mutate: categoryIconsMutate,
    isLoading: categoryIconsLoading,
  } = useSWR(masterIconEndpoint, getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, 
  });

  const getCategoryById = async (id: string): Promise<CategoryDetailType> => {
    try {
      const response = await getFetcher(`${endpoint}/${id}`);
      return response.data;
    } catch (err: any) {
      showError(err, "Failed to fetch category");
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
      showError(err, "Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, payload: UpdateCategoryDto) => {
    try {
      setIsLoading(true);
      await patchFetcher(`${endpoint}/${id}`, payload);
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      showError(err, "Failed to update category");
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
      showError(err, "Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  const value: CategoriesContextType = {
    search,
    setPage,
    isActive,
    setSearch,
    setPerPage,
    setIsActive,
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
