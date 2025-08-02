"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";
import { getFetcher, postFetcher, patchFetcher, deleteFetcher } from "@/app/api/globalFetcher";

export interface CategoryType {
  id: string;
  companyId: string;
  branchId: string;
  nameTh: string;
  nameEn?: string | null;
  icon: string | null;
  parent: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
  subCategories: CategoryType[];
}

export interface CategoryDropdownType {
  id: string;
  nameTh: string;
  nameEn?: string;
}

export interface CreateCategoryDto {
  nameTh: string;
  nameEn?: string;
  icon?: string;
  parent?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  nameTh?: string;
  nameEn?: string;
  icon?: string;
  parent?: string;
  isActive?: boolean;
}

export type CategoriesContextType = {
  categories: CategoryType[];
  dropdown: CategoryDropdownType[];
  loading: boolean;
  error: Error | null;
  categoriesMutate: () => Promise<any>;
  dropdownMutate: () => Promise<any>;
  createCategory: (payload: CreateCategoryDto) => Promise<any>;
  updateCategory: (id: string, payload: UpdateCategoryDto) => Promise<any>;
  deleteCategory: (id: string) => Promise<any>;
};

export const CategoriesContext = createContext<CategoriesContextType>({} as CategoriesContextType);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
    mutate: categoriesMutate,
  } = useSWR("/api/categories", getFetcher);

  const {
    data: dropdownData,
    error: dropdownError,
    isLoading: dropdownLoading,
    mutate: dropdownMutate,
  } = useSWR("/api/categories/dropdown", getFetcher);

  const createCategory = async (payload: CreateCategoryDto) => {
    try {
      await postFetcher("/api/categories", payload);
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      throw err;
    }
  };

  const updateCategory = async (id: string, payload: UpdateCategoryDto) => {
    try {
      await patchFetcher(`/api/categories/${id}`, payload);
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteFetcher(`/api/categories/${id}`, {});
      await categoriesMutate();
      await dropdownMutate();
    } catch (err: any) {
      throw err;
    }
  };

  const value: CategoriesContextType = {
    categories: categoriesData?.data || [],
    dropdown: dropdownData?.data || [],
    loading: categoriesLoading || dropdownLoading,
    error: categoriesError || dropdownError || null,
    categoriesMutate,
    dropdownMutate,
    createCategory,
    updateCategory,
    deleteCategory,
  };

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export const useCategories = () => useContext(CategoriesContext);
