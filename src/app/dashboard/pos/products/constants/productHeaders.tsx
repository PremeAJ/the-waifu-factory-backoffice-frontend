import { Box, keyframes } from "@mui/material";
import { CreateProductOptionPayload } from "@/common/contexts/ProductsContext/interfaces/products";
import { IconList } from "@tabler/icons-react";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import BaseChip from "@/common/components/base/BaseChip";
import BaseTooltip from "@/common/components/base/BaseTooltip";
import BaseAvatar from "@/common/components/base/BaseAvatar";
import formatNumber from "@/common/utils/formatNumber";
import formatCurrency from "@/common/utils/formatCurrency";
import useIsMobile from "@/common/utils/state/isMobile";

export const getProductHeaders = (): any => [
  {
    key: "avatar",
    label: "",
    align: "center",
    width: "5%",
    primary: false,
    sortable: false,
    render: (_val: any, item: any) => {
      const imageUrl = (() => {
        if (item.productFiles?.url) {
          return item.productFiles.url;
        }
        if (Array.isArray(item.productFiles)) {
          const detailImage = item.productFiles.find(
            (f: any) => f?.uploadedFile?.bucket === "product_detail"
          );
          if (detailImage?.uploadedFile?.url) {
            return detailImage.uploadedFile.url;
          }
        }
        return undefined;
      })();

      return (  
        <BaseAvatar
          src={imageUrl}
          alt={item.nameTh || "product"}
          size={30}
          lightbox={!!imageUrl}
          caption={item.nameTh || "Product"}
          sx={{
            border: (theme) => `2px solid ${theme.palette.divider}`,
          }}
        />
      );
    },
  },
  {
    key: "sku",
    label: "SKU / UPC",
    align: "left",
    width: "20%",
    primary: true,
    render: (_val: any, item: CreateProductOptionPayload & any) => {
      const direct = item.sku ?? item.upc;
      const variants = (item.subItems ?? item.productOptions ?? []) as any[];
      if (Array.isArray(variants) && variants.length > 0) {
        const values = variants
          .map((v: any) => (v?.sku ?? v?.upc ?? ""))
          .map((s: any) => String(s).trim())
          .filter((s: string) => s !== "");
        const uniq = Array.from(new Set(values));
        if (uniq.length === 0) return direct ?? "-";
        if (uniq.length === 1) return uniq[0];
        const first = uniq[0];
        const title = uniq.join(", ");
        return (
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
            <Box component="span">{first}</Box>
            <BaseTooltip title={title} arrow>
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
            </BaseTooltip>
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
    width: "18%",
    render: (_val: any, item: any) => {
      return item.parentNameTh ? item.variantOption?.nameTh || item.parentNameTh : item.nameTh;
    },
  },
  {
    key: "categories",
    label: "หมวดหมู่",
    align: "center",
    width: "10%",
    render: (_val: any, item: any) => {
      const categoryIcon = _val?.icon;
      const categoryColor = _val?.color;
      const categoryName = _val?.nameTh;

      if (!categoryIcon) return "-";

      return (
        <BaseTooltip title={categoryName || "หมวดหมู่"} arrow>
          <Box component="span">
            {renderTablerIcon(categoryIcon, {
              size: 18,
              color: categoryColor || undefined,
            })}
          </Box>
        </BaseTooltip>
      );
    },
  },
  {
    key: "basePrice",
    label: "ราคา",
    align: "center",
    width: "15%",
    render: (_val: any, item: any) => {
      if (item?.displayPrice && item.displayPrice !== "-") {
        const m = String(item.displayPrice).trim();
        const rangeMatch = m.match(/^([\d,.\s]+)\s*~\s*([\d,.\s]+)$/);
        if (rangeMatch) {
          return `${formatCurrency(rangeMatch[1])} ~ ${formatCurrency(rangeMatch[2])}`;
        }
        const num = Number(m.replace(/[^0-9.-]+/g, ""));
        if (!Number.isNaN(num)) return formatCurrency(num);
        return m;
      }
      if (item?.price && item.price !== "-") {
        const num = Number(String(item.price).replace(/[^0-9.-]+/g, ""));
        return !Number.isNaN(num) ? formatCurrency(num) : item.price;
      }
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
      let stockValue = 0;
      let lowStockThreshold = 3; // ✅ default

      if (typeof item.totalStock === "number") {
        stockValue = item.totalStock;
      } else if (item.inventory?.stock !== undefined) {
        stockValue = item.inventory.stock;
      }

      if (item.lowStockThreshold !== undefined) {
        lowStockThreshold = item.lowStockThreshold;
      } else if (item.productOptions && item.productOptions.length > 0) {
        lowStockThreshold = item.productOptions[0].lowStockThreshold || 3;
      }
      const isLowStock = stockValue <= lowStockThreshold && stockValue > 0;
      const displayText = `${formatNumber(stockValue)} ${item.unit || ""}`;

      return (
        <Box
          sx={{
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: 1,
            ...(isLowStock && {
              color: 'red',
            }),
          }}
        >
          {displayText}
        </Box>
      );
    },
  },
  {
    key: "status",
    label: "สถานะ",
    align: "center",
    width: "17%",
    render: (_val: any, item: any) => {
      const s = item.status ?? item.inventory?.status;
      return s ? <BaseChip preset={s} /> : "-";
    },
  },
];
export default getProductHeaders;