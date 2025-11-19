import { ReadonlyURLSearchParams } from "next/navigation";
import type { ProductFilters } from "@/common/contexts/ProductsContext/interfaces/products";

/**
 * แปลง URL Search Params เป็น ProductFilters object
 */
export const parseSearchParamsToFilters = (
  searchParams: ReadonlyURLSearchParams
): ProductFilters => {
  const statusParam = searchParams.get("status");

  return {
    search: searchParams.get("search") || "",
    status: statusParam && statusParam !== "all" ? (statusParam as any) : undefined,
    categoryId: searchParams.get("categoryId") || "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    stockMin: searchParams.get("stockMin") ? Number(searchParams.get("stockMin")) : undefined,
    stockMax: searchParams.get("stockMax") ? Number(searchParams.get("stockMax")) : undefined,
    isLowStock: searchParams.get("isLowStock") === "true",
  };
};