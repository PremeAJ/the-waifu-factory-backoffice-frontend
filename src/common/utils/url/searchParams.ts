import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * สร้าง URLSearchParams ใหม่พร้อมเก็บ params เก่า
 * @param currentParams - Current search params จาก useSearchParams()
 * @param updates - Object ของ key-value ที่ต้องการ update
 * @returns URLSearchParams string
 */
export const updateSearchParams = (
  currentParams: ReadonlyURLSearchParams | URLSearchParams,
  updates: Record<string, string | number | null>
): string => {
  const params = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
};

/**
 * ลบ params ออก
 */
export const removeSearchParams = (
  currentParams: ReadonlyURLSearchParams | URLSearchParams,
  keys: string[]
): string => {
  const params = new URLSearchParams(currentParams);
  keys.forEach((key) => params.delete(key));
  return params.toString();
};

/**
 * ดึงค่า param
 */
export const getSearchParam = (
  currentParams: ReadonlyURLSearchParams | URLSearchParams,
  key: string
): string | null => {
  return currentParams.get(key);
};