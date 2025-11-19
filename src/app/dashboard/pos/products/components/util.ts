import { ReadonlyURLSearchParams } from "next/navigation";
import { updateSearchParams } from "../../../../../common/utils/url/searchParams";

/**
 * จัดการเมื่อเปลี่ยนหน้า
 */
export const handlePageChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  newPage: number,
  onNavigate: (url: string) => void,
  onSetPage: (page: number) => void
) => {
  const queryString = updateSearchParams(currentSearchParams, { page: newPage + 1 });
  onNavigate(`/dashboard/pos/products?${queryString}`);
  onSetPage(newPage + 1);
};

/**
 * จัดการเมื่อเปลี่ยน rows per page
 */
export const handleRowsPerPageChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  perPageValue: number,
  onNavigate: (url: string) => void,
  onSetPerPage: (perPage: number) => void,
  onSetPage: (page: number) => void
) => {
  const queryString = updateSearchParams(currentSearchParams, { perPage: perPageValue, page: 1 });
  onNavigate(`/dashboard/pos/products?${queryString}`);
  onSetPerPage(perPageValue);
  onSetPage(1);
};

/**
 * ✅ จัดการเมื่อเปลี่ยน search
 */
export const handleSearchChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  searchValue: string,
  onSetFilters: (filters: any) => void,
  currentFilters: any,
  onNavigate: (url: string) => void
) => {
  const updatedFilters = { ...currentFilters, search: searchValue };
  onSetFilters(updatedFilters);
  
  const queryString = updateSearchParams(currentSearchParams, {
    ...currentFilters,
    search: searchValue || null, // ลบ search ถ้าว่าง
    page: 1, // รีเซ็ตไปหน้า 1
  });
  onNavigate(`/dashboard/pos/products?${queryString}`);
};

/**
 * จัดการเมื่อเปลี่ยน filter
 */
export const handleApplyFilterUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  newFilters: any,
  onSetFilters: (filters: any) => void,
  onNavigate: (url: string) => void
) => {
  onSetFilters(newFilters);
  newFilters.status = newFilters.status === "all" ? undefined : newFilters.status;
  newFilters.isLowStock = !newFilters.isLowStock ? undefined : newFilters.isLowStock;

  const queryString = updateSearchParams(currentSearchParams, {
    ...newFilters,
    page: 1,
  });
  onNavigate(`/dashboard/pos/products?${queryString}`);
};

/**
 * จัดการ initialization default params
 */
export const handleInitSearchParamsUtil = (currentSearchParams: ReadonlyURLSearchParams, config: any, onNavigate: (url: string) => void) => {
  const queryString = updateSearchParams(currentSearchParams, {
    page: config.defaultPage,
    perPage: config.defaultPerPage,
  });
  onNavigate(`/dashboard/pos/products?${queryString}`);
};
