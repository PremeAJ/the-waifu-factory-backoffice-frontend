"use client";

import React, { useState } from "react";
import { Box, Stack, Typography, Divider, Grid } from "@mui/material";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseChip from "@/common/components/base/BaseChip";
import formatNumber from "@/common/utils/formatNumber";
import BaseLightBox, { LightboxItem } from "@/common/components/base/BaseLightBox";
import BaseTooltip from "@/common/components/base/BaseTooltip";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";

interface ProductPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  item?: any | null;
  onPreviewVariant?: (variant: any) => void;
}

const formatCurrency = (val: number | string) => {
  const n = Number(String(val).replace(/[^0-9.-]+/g, ""));
  if (Number.isNaN(n)) return String(val ?? "-");
  return `${formatNumber(n, 0)} ฿`;
};

const ProductPreviewDialog: React.FC<ProductPreviewDialogProps> = ({ open, onClose, item = null, onPreviewVariant }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!item) return null;

  // ✅ แก้ไข: ตรวจสอบว่า item เป็น sub-item หรือไม่
  const isSubItem = !item.subItems || item.subItems.length === 0;

  // ✅ แก้ไข: รวมภาพทั้งหมด - product detail + variant thumbnails
  const allImages: string[] = (() => {
    if (isSubItem) {
      return item.productFiles?.url ? [item.productFiles.url] : [];
    }
    
    const images: string[] = [];
    
    const productFiles = (item.productFiles ?? [])
      .map((f: any) => f?.uploadedFile)
      .filter((u: any) => u && typeof u.url === "string");
    
    const detailUrls = productFiles
      .filter((u: any) => u.bucket === "product_detail")
      .map((u: any) => u.url);
    
    images.push(...detailUrls);
    
    const variants = item.subItems ?? item.productOptions ?? [];
    const variantThumbnails = variants
      .map((v: any) => v.productFiles?.url)
      .filter((url: any) => url && typeof url === "string");
    
    images.push(...variantThumbnails);
    
    return images.filter(Boolean);
  })();

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  // ✅ แก้ไข: แสดง SKU ของ sub-item หรือ aggregate
  const skuAggregate = (() => {
    if (isSubItem) {
      return item.sku ?? item.upc ?? "-";
    }
    const variants = item.subItems ?? item.productOptions ?? [];
    if (!Array.isArray(variants) || variants.length === 0) return item.sku ?? item.upc ?? "-";
    const values = variants.map((v: any) => v.sku ?? v.upc).filter(Boolean);
    const uniq = Array.from(new Set(values));
    if (uniq.length === 0) return "-";
    if (uniq.length === 1) return uniq[0];
    return uniq.join(", ");
  })();

  const priceDisplay = isSubItem
    ? (typeof item.basePrice === "number" ? formatCurrency(item.basePrice) : "-")
    : (item.displayPrice && item.displayPrice !== "-"
        ? item.displayPrice
        : typeof item.basePrice === "number"
        ? formatCurrency(item.basePrice)
        : "-");

  const stockDisplay = isSubItem
    ? (item.inventory?.stock !== undefined
        ? `${formatNumber(item.inventory.stock)} ${item.unit ?? ""}`
        : "-")
    : (typeof item.totalStock === "number"
        ? `${formatNumber(item.totalStock)} ${item.unit ?? ""}`
        : item.inventory?.stock !== undefined
        ? `${formatNumber(item.inventory.stock)} ${item.unit ?? ""}`
        : "-");

  const status = item.status ?? item.inventory?.status ?? "-";

  // ✅ เพิ่ม: ฟังก์ชันเมื่อกด card variant
  const handleVariantClick = (variant: any) => {
    onClose(); // ปิด dialog ปัจจุบัน
    if (onPreviewVariant) {
      onPreviewVariant(variant); // เปิด dialog ของ variant
    }
  };

  const dialogContent = (
    <Box sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Box>
          {allImages.length > 0 ? (
            <>
              {/* ✅ ภาพหลัก - แสดงภาพแรก */}
              <Box
                component="img"
                src={allImages[0]}
                alt={`${item.nameTh ?? "product"}-main`}
                onClick={() => openLightbox(0)}
                sx={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              />
              
              {/* ✅ Gallery thumbnails - แสดงทุกภาพ (product detail + variant thumbnails) */}
              {allImages.length > 1 && (
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {allImages.map((src, i) => (
                    <Grid key={src + i}>
                      <Box
                        component="img"
                        src={src}
                        alt={`${item.nameTh ?? "product"}-${i}`}
                        onClick={() => openLightbox(i)}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: "cover",
                          borderRadius: 1,
                          cursor: "pointer",
                          border: (theme) => `2px solid ${i === 0 ? theme.palette.primary.main : theme.palette.divider}`,
                          opacity: i === 0 ? 1 : 0.7,
                          transition: "all 0.2s",
                          "&:hover": {
                            opacity: 1,
                            borderColor: "primary.main",
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper",
                borderRadius: 1,
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <Typography color="text.secondary">No image</Typography>
            </Box>
          )}
        </Box>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">SKU / UPC</Typography>
          <Typography variant="body2" fontWeight={600}>{skuAggregate}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">ชื่อ (TH)</Typography>
          <Typography variant="body2" fontWeight={600}>{item.nameTh ?? "-"}</Typography>
        </Stack>

        {/* ✅ เพิ่ม: หมวดหมู่ icon */}
        {item.categories && (
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">หมวดหมู่</Typography>
            <Box>
              {item.categories?.icon ? (
                <BaseTooltip title={item.categories?.nameTh || "หมวดหมู่"} arrow>
                  <Box component="span">
                    {renderTablerIcon(item.categories.icon, {
                      size: 18,
                      color: item.categories?.color || undefined,
                    })}
                  </Box>
                </BaseTooltip>
              ) : (
                <Typography variant="body2" fontWeight={600}>-</Typography>
              )}
            </Box>
          </Stack>
        )}

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">ราคา</Typography>
          <Typography variant="body2" fontWeight={600}>{priceDisplay}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">จำนวนสต็อก</Typography>
          <Typography variant="body2" fontWeight={600}>{stockDisplay}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2">สถานะ</Typography>
          <Box>{status !== "-" ? <BaseChip preset={status} /> : <Typography variant="body2" fontWeight={600}>-</Typography>}</Box>
        </Stack>

        {/* ✅ แก้ไข: ซ่อน Variants section ถ้าเป็น sub-item */}
        {!isSubItem && (
          <>
            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2" fontWeight={600}>Variants</Typography>
            <Grid container spacing={1}>
              {(item.subItems ?? item.productOptions ?? []).map((v: any) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={v.id ?? JSON.stringify(v)}>
                  <Box
                    onClick={() => handleVariantClick(v)}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 1,
                      mb: 1,
                      bgcolor: "background.paper",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: 2,
                        transform: "translateY(-2px)",
                      }
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {v.variantOption?.nameTh ?? v.sku ?? v.upc ?? "-"}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="text.secondary">ราคา:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {typeof v.basePrice === "number"
                            ? formatCurrency(v.basePrice)
                            : v.finalPrice
                            ? formatCurrency(v.finalPrice)
                            : "-"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="text.secondary">สต็อก:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {v.inventory?.stock ?? "-"} {item.unit ?? ""}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="text.secondary">SKU:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {v.sku ?? v.upc ?? "-"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="text.secondary">สถานะ:</Typography>
                        <Box>
                          {v.inventory?.status ? <BaseChip preset={v.inventory.status} /> : <Typography variant="body2" fontWeight={600}>-</Typography>}
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              ))}
              {(item.subItems ?? item.productOptions ?? []).length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2">No variants</Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Stack>
    </Box>
  );

  const lightboxItems: LightboxItem[] = allImages.map((src, i) => ({
    src,
    alt: `${item.nameTh ?? "product"}-${i}`,
    caption: `${item.nameTh ?? "-"} (${i + 1}/${allImages.length})`,
  }));

  return (
    <>
      <BaseDialog
        open={open}
        onClose={onClose}
        title={`Preview: ${item.nameTh ?? item.name ?? "-"}`}
        content={dialogContent}
        disableBackdropClose={false}
      />
      <BaseLightBox
        open={lightboxOpen}
        onClose={closeLightbox}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onChangeIndex={(idx) => setLightboxIndex(idx)}
        showCounter
        sx={{}}
      />
    </>
  );
};

export default ProductPreviewDialog;
