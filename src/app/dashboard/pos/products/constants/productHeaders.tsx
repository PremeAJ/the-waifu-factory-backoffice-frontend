import BaseChip from "@/common/components/base/BaseChip";
import { CreateProductOptionPayload } from "@/common/contexts/ProductsContext/interfaces/products";

export const getProductHeaders = ():any => [
  {
    key: "sku",
    label: "SKU / UPC",
    align: "left",
    width: "20%",
    primary: true,
    render: (_val: any, item: CreateProductOptionPayload) => item.sku ?? item.upc ?? "-",
  },
  {
    key: "nameTh",
    label: "ชื่อ (TH)",
    align: "center",
    width: "20%",
    render: (_val: any, item: any) => (item.parentNameTh ? item.variantOption?.nameTh || item.parentNameTh : item.nameTh),
  },
  {
    key: "basePrice",
    label: "ราคา",
    align: "center",
    width: "15%",
    render: (_val: any, item: CreateProductOptionPayload) => (typeof item.basePrice === "number" ? item.basePrice : "-"),
  },
  {
    key: "stock",
    label: "จำนวนสต็อก",
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
    label: "สถานะ",
    align: "center",
    width: "20%",
    render: (_val: any, item: any) => {
      const s = item.status ?? item.inventory?.status;
      return s ? <BaseChip preset={s} /> : "-";
    },
  },
];