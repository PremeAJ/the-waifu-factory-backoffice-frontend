import { ReadonlyURLSearchParams } from "next/navigation";
import { updateSearchParams } from "../../../../../common/utils/url/searchParams";

/**
 * จัดการเมื่อเปลี่ยนหน้า - เพียงอัพเดท URL เท่านั้น
 */
export const handlePageChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  newPage: number,
  onNavigate: (url: string) => void
) => {
  const queryString = updateSearchParams(currentSearchParams, { page: newPage + 1 });
  onNavigate(`/dashboard/pos/products?${queryString}`);
  // ✅ ลบ onSetPage ออก - Context จะหยิบ page จาก URL อัตโนมัติ
};

/**
 * จัดการเมื่อเปลี่ยน rows per page
 */
export const handleRowsPerPageChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  perPageValue: number,
  onNavigate: (url: string) => void
) => {
  const queryString = updateSearchParams(currentSearchParams, { perPage: perPageValue, page: 1 });
  onNavigate(`/dashboard/pos/products?${queryString}`);
  // ✅ ลบ onSetPerPage, onSetPage ออก
};

/**
 * จัดการเมื่อเปลี่ยน search
 */
export const handleSearchChangeUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  searchValue: string,
  onNavigate: (url: string) => void
) => {
  const queryString = updateSearchParams(currentSearchParams, {
    search: searchValue || null,
    page: 1,
  });
  onNavigate(`/dashboard/pos/products?${queryString}`);
  // ✅ ลบ onSetFilters ออก
};

/**
 * จัดการเมื่อเปลี่ยน filter
 */
export const handleApplyFilterUtil = (
  currentSearchParams: ReadonlyURLSearchParams,
  newFilters: any,
  onNavigate: (url: string) => void
) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(newFilters).filter(
      ([_, value]) => value !== null && value !== undefined && value !== "" && value !== false
    )
  );

  // ✅ ลบ "all" และ default values
  if (cleanFilters.status === "all") delete cleanFilters.status;
  if (cleanFilters.isLowStock === false) delete cleanFilters.isLowStock;

  const queryString = updateSearchParams(currentSearchParams, {
    ...cleanFilters,
    page: 1,
  });
  onNavigate(`/dashboard/pos/products?${queryString}`);
  // ✅ ลบ onSetFilters ออก
};

/**
 * จัดการ initialization default params
 */
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
  // ✅ ไม่ต้องทำอะไร เพราะ Context จะอ่านจาก URL เองแล้ว
};
