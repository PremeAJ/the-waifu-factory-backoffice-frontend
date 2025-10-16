import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import BaseChip from "@/common/components/base/BaseChip";

export const getProductHeaders = ():any => [
  {
    key: "sku",
    label: "SKU / UPC",
    align: "left",
    width: "20%",
    primary: true,
    render: (_val: any, item: any) => item.sku ?? item.upc ?? "-",
  },
  {
    key: "nameTh",
    label: "Name (TH)",
    align: "center",
    width: "20%",
    render: (_val: any, item: any) => (item.parentNameTh ? item.variantOption?.nameTh || item.parentNameTh : item.nameTh),
  },
  {
    key: "price",
    label: "Price",
    align: "center",
    width: "15%",
    render: (_val: any, item: any) => (typeof item.price === "number" ? item.price : "-"),
  },
  {
    key: "stock",
    label: "Stock",
    align: "center",
    width: "10%",
    render: (_val: any, item: any) => {
      if (typeof item.totalStock === "number") return `${item.totalStock} ${item.unit || ""}`;
      if (item.inventory?.stock !== undefined) return `${item.inventory.stock} ${item.unit || ""}`;
      return "-";
    },
  },
  {
    key: "status",
    label: "Status",
    align: "center",
    width: "20%",
    render: (_val: any, item: any) => {
      const s = item.status ?? item.inventory?.status;
      return s ? <BaseChip preset={s} /> : "-";
    },
  },
];