import { ReadonlyURLSearchParams } from "next/navigation";
import type { MenuFilters } from "./interfaces/menu";

/**
 * แปลง URL Search Params เป็น MenuFilters object
 */
export const parseSearchParamsToMenuFilters = (searchParams: ReadonlyURLSearchParams): MenuFilters => {
  const statusParam = searchParams.get("status");
  return {
    search: searchParams.get("search") || "",
    status: statusParam && statusParam !== "all" ? (statusParam as MenuFilters["status"]) : undefined,
    categoryId: searchParams.get("categoryId") || undefined,
  };
};