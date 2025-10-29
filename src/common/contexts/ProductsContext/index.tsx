"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from "@/app/api/globalFetcher";
import { swrOption } from "@/app/api/swrOption";
import { defaultPageOptions } from "@/common/interface/paginate";
import { useDialog } from "../DialogContext";
import { ProductsContextType, ProductType, CreateProductPayload, UpdateProductPayload } from "./interfaces/products";

export const ProductsContext = createContext<ProductsContextType>({} as ProductsContextType);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const endpoint = "/api/product";
  const { showError } = useDialog();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      if (search !== debouncedSearch) setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const productsUrl = useMemo(() => {
    const q = new URLSearchParams();
    q.set("page", String(page));
    q.set("perPage", String(perPage));
    if (debouncedSearch && debouncedSearch.trim()) q.set("search", debouncedSearch.trim());
    return `${endpoint}?${q.toString()}`;
  }, [page, perPage, debouncedSearch]);
  console.log("🚀 ~ ProductsProvider ~ productsUrl:", productsUrl)

  const { data: productsData, error: productsError, isLoading: productsLoading, mutate: productsMutate } = useSWR(productsUrl, getFetcher, swrOption);

  // dropdown/all icons or auxiliary endpoints can be added similarly
  const findAllProducts = async (): Promise<ProductType[]> => {
    try {
      const res = await getFetcher(`${endpoint}/findall`);
      return res?.data || [];
    } catch (err: any) {
      showError({ title: "Failed", message: err?.message || "Failed to fetch products" });
      return [];
    }
  };

  const getProductById = async (id: string): Promise<ProductType> => {
    try {
      const res = await getFetcher(`${endpoint}/${id}`);
      return res.data;
    } catch (err: any) {
      showError({ title: "Failed", message: err?.message || "Failed to fetch product" });
      throw err;
    }
  };

  const createProduct = async (payload: CreateProductPayload) => {
    try {
      setIsLoading(true);
      await postFetcher(endpoint, payload);
      await productsMutate();
    } catch (err: any) {
      showError({ title: "Failed", message: err?.message || "Failed to create product" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, payload: UpdateProductPayload) => {
    try {
      setIsLoading(true);
      await putFetcher(`${endpoint}/${id}`, payload);
      await productsMutate();
    } catch (err: any) {
      showError({ title: "Failed", message: err?.message || "Failed to update product" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteFetcher(`${endpoint}/${id}`, {});
      await productsMutate();
    } catch (err: any) {
      showError({ title: "Failed", message: err?.message || "Failed to delete product" });
    } finally {
      setIsLoading(false);
    }
  };

  const value: ProductsContextType = {
    products: productsData?.data?.data || productsData?.data || [],
    productsMutate,
    findAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    loading: productsLoading || isLoading,
    pageOptions: productsData?.data?.pageOptions || defaultPageOptions,
    search,
    setSearch,
    setPage,
    setPerPage,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
