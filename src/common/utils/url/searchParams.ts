import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * สร้าง URLSearchParams ใหม่พร้อมเก็บ params เก่า
 */
export const updateSearchParams = (
  currentParams: ReadonlyURLSearchParams | URLSearchParams,
  updates: Record<string, string | number | boolean | null | undefined>
): string => {
  // ใช้ .toString() เสมอเพื่อ copy ค่าให้เป็น URLSearchParams จริง
  const params = new URLSearchParams(currentParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "" || (typeof value === "boolean" && value === false)) {
      params.delete(key);
      return;
    }
    if (key === "status" && String(value) === "all") {
      params.delete(key);
      return;
    }
    params.set(key, String(value));
  });

  return params.toString();
};


export const removeSearchParams = (
  currentParams: ReadonlyURLSearchParams | URLSearchParams,
  keys: string[]
): string => {
  const params = new URLSearchParams(currentParams);
  keys.forEach((key) => params.delete(key));
  return params.toString();
};


export const getSearchParam = (
  currentParams: ReadonlyURLSearchParams | URLSearchParams,
  key: string
): string | null => {
  return currentParams.get(key);
};