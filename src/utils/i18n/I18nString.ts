import config from "@/context/setting/config";

export function I18nString(isLanguage = config.isLanguage, stringTh = '', stringEn = ''): string {
  return isLanguage === "en" ? stringEn || stringTh : stringTh;
}
