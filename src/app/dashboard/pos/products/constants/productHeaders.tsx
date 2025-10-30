import BaseChip from "@/common/components/base/BaseChip";
import { CreateProductOptionPayload } from "@/common/contexts/ProductsContext/interfaces/products";
import formatNumber from "@/common/utils/formatNumber";
import { Box, Tooltip } from "@mui/material";
import { IconList } from "@tabler/icons-react";

const formatCurrency = (val: number | string) => {
  const formatted = formatNumber(val, 0);
  return `${formatted} ฿`;
};

export const getProductHeaders = (): any => [
  {
    key: "sku",
    label: "SKU / UPC",
    align: "left",
    width: "20%",
    primary: true,
    render: (_val: any, item: CreateProductOptionPayload & any) => {
      // prefer direct sku/upc for single items
      const direct = item.sku ?? item.upc;
      // collect variant skus/upcs when present
      const variants = (item.subItems ?? item.productOptions ?? []) as any[];
      if (Array.isArray(variants) && variants.length > 0) {
        const values = variants
          .map((v: any) => (v?.sku ?? v?.upc ?? ""))
          .map((s: any) => String(s).trim())
          .filter((s: string) => s !== "");
        const uniq = Array.from(new Set(values));
        if (uniq.length === 0) return direct ?? "-";
        if (uniq.length === 1) return uniq[0];
        // multiple different SKUs -> show first + icon with tooltip listing all
        const first = uniq[0];
        const title = uniq.join(", ");
        return (
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
            <Box component="span">{first}</Box>
            <Tooltip title={title} placement="top" arrow>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 22,
                  height: 22,
                  borderRadius: 1,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "text.secondary",
                  cursor: "pointer",
                }}
                aria-label={`${uniq.length} skus`}
              >
                <IconList size={14} />
              </Box>
            </Tooltip>
          </Box>
        );
      }
      return direct ?? "-";
    },
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
    render: (_val: any, item: any) => {
      // prefer explicit displayPrice (string range) set for main products with variants
      if (item?.displayPrice && item.displayPrice !== "-") {
        const m = String(item.displayPrice).trim();
        const rangeMatch = m.match(/^([\d,.\s]+)\s*~\s*([\d,.\s]+)$/);
        if (rangeMatch) {
          return `${formatCurrency(rangeMatch[1])} ~ ${formatCurrency(rangeMatch[2])}`;
        }
        // try numeric parse
        const num = Number(m.replace(/[^0-9.-]+/g, ""));
        if (!Number.isNaN(num)) return formatCurrency(num);
        return m;
      }
      // fallback to legacy price string
      if (item?.price && item.price !== "-") {
        const num = Number(String(item.price).replace(/[^0-9.-]+/g, ""));
        return !Number.isNaN(num) ? formatCurrency(num) : item.price;
      }
      // numeric fallbacks (option or product)
      const num = item?.basePrice ?? item?.finalPrice ?? item?.price;
      if (typeof num === "number") return formatCurrency(num);
      return "-";
    },
  },
  {
    key: "stock",
    label: "จำนวนสต็อก",
    align: "center",
    width: "10%",
    render: (_val: any, item: any) => {
      if (typeof item.totalStock === "number") return `${formatNumber(item.totalStock)} ${item.unit || ""}`;
      if (item.inventory?.stock !== undefined) return `${formatNumber(item.inventory.stock)} ${item.unit || ""}`;
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
export default getProductHeaders;