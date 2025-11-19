import { updateSearchParams } from "@/common/utils/url/searchParams";
import { ReadonlyURLSearchParams } from "next/navigation";

export const handlePageChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  newPage: number,
  onNavigate: (url: string) => void
) => {
  const queryString = updateSearchParams(currentSearchParams, { page: newPage + 1 });
  onNavigate(`/dashboard/pos/products?${queryString}`);
};

export const handleRowsPerPageChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  perPageValue: number,
  onNavigate: (url: string) => void
) => {
  const queryString = updateSearchParams(currentSearchParams, { perPage: perPageValue, page: 1 });
  onNavigate(`/dashboard/pos/products?${queryString}`);
};

export const handleSearchChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  searchValue: string,
  onNavigate: (url: string) => void,
) => {
  const queryString = updateSearchParams(currentSearchParams, {
    search: searchValue || null,
    page: 1,
  });
  onNavigate(`/dashboard/pos/products?${queryString}`);
};

export const handleApplyFilterUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  newFilters: any,
  onNavigate: (url: string) => void
) => {
  const params = new URLSearchParams(currentSearchParams);
  Object.entries(newFilters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "" || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });
  
  params.set("page", "1");
  
  onNavigate(`/dashboard/pos/products?${params.toString()}`);
};

export const handleInitSearchParamsUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  config: any,
  onNavigate: (url: string) => void
) => {
  const queryString = updateSearchParams(currentSearchParams, {
    page: config.defaultPage,
    perPage: config.defaultPerPage,
  });
  onNavigate(`/dashboard/pos/products?${queryString}`);
};
