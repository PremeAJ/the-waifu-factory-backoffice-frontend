import { omitBy, isUndefined, isNull, isString } from "lodash";

/** ลบ property ที่เป็น undefined */
export function removeUndefined<T extends object>(obj: T): Record<string, any> {
  return omitBy(obj, isUndefined);
}

/** ลบ property ที่เป็น undefined หรือ null */
export function removeUndefinedAndNull<T extends object>(obj: T): Record<string, any> {
  return omitBy(obj, v => isUndefined(v) || isNull(v));
}

/** ลบ property ที่เป็น undefined, null, หรือ string ว่าง */
export function removeBlank<T extends object>(obj: T): Record<string, any> {
  return omitBy(obj, v => isUndefined(v) || isNull(v) || (isString(v) && v.trim() === ""));
}

/** ลบ property ที่เป็น falsy (undefined, null, '', 0, false, NaN) */
export function removeFalsy<T extends object>(obj: T): Record<string, any> {
  return omitBy(obj, v => !v);
}