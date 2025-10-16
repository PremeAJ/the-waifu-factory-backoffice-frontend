import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import BaseChip from "@/common/components/base/BaseChip";
import type { CategoryStatus } from "@/common/contexts/CategoriesContext/interfaces/categories";

export const getCategoryHeaders = (isLanguage?: string):any => [
  {
    key: "icon",
    label: "Icon",
    align: "center",
    width: "10%",
    render: (iconName: string) => (iconName ? renderTablerIcon(iconName) : "-"),
  },
  {
    key: "nameTh",
    label: "Name (TH)",
    align: "left",
    width: "25%",
    render: (value: string) => value || "-",
    ...(isLanguage === "th" ? { primary: true } : {}),
  },
  {
    key: "nameEn",
    label: "Name (EN)",
    align: "left",
    width: "25%",
    render: (value: string) => value || "-",
    ...(isLanguage === "en" ? { primary: true } : {}),
  },
  {
    key: "status",
    label: "Status",
    align: "center",
    width: "20%",
    render: (status: CategoryStatus) => <BaseChip preset={status} />,
  },
];