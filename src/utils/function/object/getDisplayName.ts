// utils/getDisplayName.ts
type Lang = "th" | "en";

/**
 * รับ array object, ภาษา, key ที่ใช้ filter, ชื่อ field ภาษาไทย, ชื่อ field ภาษาอังกฤษ
 * คืนค่า string ตามภาษาจาก object ที่ filter ได้
 * ถ้าไม่เจอ key ภาษาอังกฤษ ให้ fallback เป็น key ภาษาไทย
 */
export function getDisplayName<T>(
  arr: T[],
  filterKey: keyof T,
  filterValue: any,
  nameThKey: keyof T,
  nameEnKey: keyof T,
  language: Lang
): string {
  const found = arr.find((item) => item[filterKey] === filterValue);
  if (!found) return "-";
  if (language === "th") {
    return (found[nameThKey] as string) || "-";
  }
  // ถ้าไม่มีค่า en ให้ fallback เป็น th
  return (found[nameEnKey] as string) || (found[nameThKey] as string) || "-";
}