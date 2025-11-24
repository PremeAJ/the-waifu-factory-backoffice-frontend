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
import { useMemo } from "react";

// ✅ สร้าง component wrapper เพื่อใช้ hook
const AvatarCell = ({ item }: { item: any }) => {
  const isMobile = useIsMobile(); // ✅ ใช้ hook ที่นี่
  const avatarSize = isMobile ? 80 : 30; // ✅ responsive size

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
      size={avatarSize}
      lightbox={!!imageUrl}
      caption={item.nameTh || "Product"}
      sx={{
        border: (theme) => `2px solid ${theme.palette.divider}`,
      }}
    />
  );
};

export const getProductHeaders = (): any => [
  {
    key: "avatar",
    label: "",
    align: "center",
    width: "5%",
    primary: false,
    sortable: false,
    render: (_val: any, item: any) => {
      return <AvatarCell item={item} />; // ✅ ใช้ component แทน
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
      const getDiscountTooltip = (it: any) => {
        let type = it?.discountType;
        let rate = it?.discountRate;
        let base = it?.basePrice;
        let final = it?.finalPrice;

        // prefer single productOption discount info if present
        if ((!type || rate === undefined) && Array.isArray(it?.productOptions) && it.productOptions.length === 1) {
          const po = it.productOptions[0];
          type = type ?? po?.discountType;
          rate = rate ?? po?.discountRate;
          base = base ?? po?.basePrice;
          final = final ?? po?.finalPrice;
        }

        if (type === "percentage" && typeof rate === "number") {
          if (typeof base === "number") {
            const amount = (base * rate) / 100;
            return `ลดราคา ${rate}% (${formatCurrency(amount)})`;
          }
          return `ลดราคา ${rate}%`;
        }

        if (type === "fixed" && typeof rate === "number") {
          return `ลดราคา ${formatCurrency(rate)}`;
        }

        if (typeof base === "number" && typeof final === "number" && final < base) {
          const amount = base - final;
          const pct = Math.round((amount / base) * 100);
          return `ลดราคา ${pct}% (${formatCurrency(amount)})`;
        }

        return undefined;
      };

      const discountTip = getDiscountTooltip(item);

      // display range like before
      if (item?.displayPrice && item.displayPrice !== "-") {
        const m = String(item.displayPrice).trim();
        const rangeMatch = m.match(/^([\d,.\s]+)\s*~\s*([\d,.\s]+)$/);
        if (rangeMatch) {
          const node = (
            <Box component="span">{`${formatCurrency(rangeMatch[1])} ~ ${formatCurrency(rangeMatch[2])}`}</Box>
          );
          return discountTip ? <BaseTooltip title={discountTip} arrow>{node}</BaseTooltip> : node;
        }

        const num = Number(m.replace(/[^0-9.-]+/g, ""));
        const hasDiscount =
          (item.discountType && item.discountType !== "none") ||
          (item.productOptions && item.productOptions.length === 1 && item.productOptions[0].discountType && item.productOptions[0].discountType !== "none") ||
          (typeof item.basePrice === "number" && typeof item.finalPrice === "number" && item.finalPrice < item.basePrice);

        if (!Number.isNaN(num)) {
          if (hasDiscount && typeof item.basePrice === "number" && typeof item.finalPrice === "number") {
            const node = (
              <Box component="span">
                <Box component="span" sx={{ textDecoration: "line-through", color: "error.main", mr: 1 }}>
                  {formatCurrency(item.basePrice)}
                </Box>
                <Box component="span">{formatCurrency(item.finalPrice)}</Box>
              </Box>
            );
            return discountTip ? <BaseTooltip title={discountTip} arrow>{node}</BaseTooltip> : node;
          }
          return formatCurrency(num);
        }
        return m;
      }

      // fallback: check explicit price / basePrice / finalPrice
      const fallbackNum = item?.price ?? item?.finalPrice ?? item?.basePrice;
      if (typeof fallbackNum === "number") {
        if (typeof item.basePrice === "number" && typeof item.finalPrice === "number" && item.finalPrice < item.basePrice) {
          const node = (
            <Box component="span">
              <Box component="span" sx={{ textDecoration: "line-through", color: "error.main", mr: 1 }}>
                {formatCurrency(item.basePrice)}
              </Box>
              <Box component="span">{formatCurrency(item.finalPrice)}</Box>
            </Box>
          );
          return discountTip ? <BaseTooltip title={discountTip} arrow>{node}</BaseTooltip> : node;
        }
        return formatCurrency(fallbackNum);
      }
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
      let lowStockThreshold = 3;

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
      const isLowStock = stockValue <= lowStockThreshold;
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
          {stockValue === 0 ? 'สินค้าหมด' : displayText}
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