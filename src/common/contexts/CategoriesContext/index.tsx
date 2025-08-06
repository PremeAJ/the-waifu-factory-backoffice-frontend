"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { getFetcher, postFetcher, patchFetcher, deleteFetcher } from "@/app/api/globalFetcher";
import { defaultPageOptions } from "@/common/interface/paginate";
import { CategoriesContextType, CategoryDetailType, CreateCategoryDto, UpdateCategoryDto } from "./interfaces/categories";


export const CategoriesContext = createContext<CategoriesContextType>({} as CategoriesContextType);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const endpoint = "/api/categories";
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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
    isLoading: dropdownLoading,
    mutate: dropdownMutate,
  } = useSWR(`${endpoint}/dropdown`, getFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, 
  });

  const getCategoryById = async (id: string): Promise<CategoryDetailType> => {
    try {
      const response = await getFetcher(`${endpoint}/${id}`);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const createCategory = async (payload: CreateCategoryDto) => {
    try {
      await postFetcher(endpoint, payload);
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      throw err;
    }
  };

  const updateCategory = async (id: string, payload: UpdateCategoryDto) => {
    try {
      await patchFetcher(`${endpoint}/${id}`, payload);
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteFetcher(`${endpoint}/${id}`, {});
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      throw err;
    }
  };

  const value: CategoriesContextType = {
    categories: categoriesData?.data?.data || [],
    categoriesMutate,
    createCategory,
    deleteCategory,
    dropdown: dropdownData?.data || [],
    dropdownMutate,
    error: categoriesError || dropdownError || null,
    getCategoryById,
    isActive,
    loading: categoriesLoading,
    pageOptions: categoriesData?.data?.pageOptions || defaultPageOptions,
    search,
    setIsActive,
    setPage,
    setPerPage,
    setSearch,
    updateCategory,
  };

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export const useCategories = () => useContext(CategoriesContext);
