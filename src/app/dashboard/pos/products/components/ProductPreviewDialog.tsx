"use client";

import React, { useState } from "react";
import { Box, Stack, Typography, Divider, List, ListItem, ListItemText, Grid } from "@mui/material";
import BaseDialog from "@/common/components/base/BaseDialog";
import BaseChip from "@/common/components/base/BaseChip";
import formatNumber from "@/common/utils/formatNumber";
import BaseLightBox, { LightboxItem } from "@/common/components/base/BaseLightBox";

interface ProductPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  item?: any | null;
}

const formatCurrency = (val: number | string) => {
  const n = Number(String(val).replace(/[^0-9.-]+/g, ""));
  if (Number.isNaN(n)) return String(val ?? "-");
  return `${formatNumber(n, 0)} ฿`;
};

const ProductPreviewDialog: React.FC<ProductPreviewDialogProps> = ({ open, onClose, item = null }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!item) return null;

  const images: string[] =
    (item.productFiles ?? []).map((f: any) => f?.uploadedFile?.url).filter((u: any) => typeof u === "string" && u.length > 0) || [];

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const skuAggregate = (() => {
    const variants = item.subItems ?? item.productOptions ?? [];
    if (!Array.isArray(variants) || variants.length === 0) return item.sku ?? item.upc ?? "-";
    const values = variants.map((v: any) => v.sku ?? v.upc).filter(Boolean);
    const uniq = Array.from(new Set(values));
    if (uniq.length === 0) return "-";
    if (uniq.length === 1) return uniq[0];
    return uniq.join(", ");
  })();

  const priceDisplay =
    item.displayPrice && item.displayPrice !== "-"
      ? item.displayPrice
      : typeof item.basePrice === "number"
      ? `${formatCurrency(item.basePrice)}`
      : "-";

  const stockDisplay =
    typeof item.totalStock === "number"
      ? `${formatNumber(item.totalStock)} ${item.unit ?? ""}`
      : item.inventory?.stock !== undefined
      ? `${formatNumber(item.inventory.stock)} ${item.unit ?? ""}`
      : "-";

  const status = item.status ?? item.inventory?.status ?? "-";

  const dialogContent = (
    <Box sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Box>
          {images.length > 0 ? (
            <>
              <Box
                component="img"
                src={images[0]}
                alt={`${item.nameTh ?? "product"}-0`}
                onClick={() => openLightbox(0)}
                sx={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
              />
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {images.map((src, i) => (
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
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
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
          <Typography variant="body2">{skuAggregate}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">ชื่อ (TH)</Typography>
          <Typography variant="body2">{item.nameTh ?? "-"}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">ราคา</Typography>
          <Typography variant="body2">{priceDisplay}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2">จำนวนสต็อก</Typography>
          <Typography variant="body2">{stockDisplay}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2">สถานะ</Typography>
          <Box>{status !== "-" ? <BaseChip preset={status} /> : <Typography variant="body2">-</Typography>}</Box>
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle2">Variants</Typography>
        <List dense disablePadding>
          {(item.subItems ?? item.productOptions ?? []).map((v: any) => (
            <ListItem key={v.id ?? JSON.stringify(v)} sx={{ py: 0.5 }}>
              <ListItemText
                primary={v.variantOption?.nameTh ?? v.sku ?? v.upc ?? "-"}
                secondary={`Price: ${
                  typeof v.basePrice === "number" ? formatCurrency(v.basePrice) : v.finalPrice ? formatCurrency(v.finalPrice) : "-"
                } • Stock: ${v.inventory?.stock ?? "-"}`}
              />
            </ListItem>
          ))}
          {(item.subItems ?? item.productOptions ?? []).length === 0 && (
            <ListItem>
              <ListItemText primary="No variants" />
            </ListItem>
          )}
        </List>
      </Stack>
    </Box>
  );

  const lightboxItems: LightboxItem[] = images.map((src, i) => ({
    src,
    alt: `${item.nameTh ?? "product"}-${i}`,
    caption: item.nameTh ?? "-",
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

      {/* Use BaseLightBox for image viewing */}
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
