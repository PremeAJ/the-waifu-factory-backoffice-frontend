export function I18nString(isLanguage: string, stringTh: string | null = "", stringEn: string | null = ""): string {
  const text = isLanguage === "en" ? stringEn || stringTh : stringTh
  return text || "";
}