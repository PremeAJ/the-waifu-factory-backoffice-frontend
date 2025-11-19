import config from "@/common/contexts/setting/config";
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
  const queryString = updateSearchParams(currentSearchParams, newFilters);
  onNavigate(`/dashboard/pos/products?${queryString}`);
};

export const handleInitSearchParamsUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  onNavigate: (url: string) => void
) => {
  const params = new URLSearchParams(currentSearchParams);
  const page = params.get("page");;
  const perPage = params.get("perPage");
  const queryString = updateSearchParams(currentSearchParams, {
    page: page ? page : config.defaultPage,
    perPage: perPage ? perPage : config.defaultPerPage,
  });
  onNavigate(`/dashboard/pos/products?${queryString}`);
};
