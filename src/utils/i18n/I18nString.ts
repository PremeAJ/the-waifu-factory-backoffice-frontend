import config from "@/context/setting/config";

export function I18nString(isLanguage = config.isLanguage, stringTh: string, stringEn?: string | null) {
  return isLanguage === "en" ? stringEn || stringTh : stringTh;
}
