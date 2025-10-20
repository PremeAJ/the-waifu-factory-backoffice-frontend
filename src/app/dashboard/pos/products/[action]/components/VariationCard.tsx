"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Button, Grid, Tooltip, MenuItem, IconButton, Typography, Stack } from "@mui/material";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import BaseTextField from "@/common/components/base/BaseTextField";
import { IconX } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import CustomSelect from "@/components/forms/theme-elements/CustomSelect";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseChip from "@/common/components/base/BaseChip";

interface VariationCardProps {
  formik?: any;
}

/**
 * New shape:
 * formik.values.variant => { nameTh, nameEn }
 * formik.values.productOptions => [{ upc, sku, price, variantOption: {nameTh,nameEn}, inventory: { status, stock } }, ...]
 */
const emptyOption = () => ({
  upc: "",
  sku: "",
  price: 0,
  variantOption: { nameTh: "", nameEn: "" },
  inventory: { status: "active", stock: 0 },
});

const VariationCard: React.FC<VariationCardProps> = ({ formik }) => {
  // ensure defaults exist
  const variant = formik?.values?.variant ?? { nameTh: "", nameEn: "" };
  const productOptions = formik?.values?.productOptions ?? [];

  const setVariantField = (field: string, value: any) => {
    if (!formik) return;
    formik.setFieldValue(`variant.${field}`, value);
  };

  const addOption = () => {
    if (!formik) return;
    const next = [...productOptions, emptyOption()];
    formik.setFieldValue("productOptions", next);
  };

  const removeOption = (index: number) => {
    if (!formik) return;
    const next = productOptions.slice();
    next.splice(index, 1);
    formik.setFieldValue("productOptions", next);
  };

  const updateOption = (index: number, path: string, value: any) => {
    if (!formik) return;
    const next = productOptions.slice();
    // support nested paths like "variantOption.nameTh" or "inventory.stock"
    const parts = path.split(".");
    let target: any = next[index];
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (target[p] === undefined) target[p] = {};
      target = target[p];
    }
    target[parts[parts.length - 1]] = value;
    formik.setFieldValue("productOptions", next);
  };

  return (
    <Box p={3}>
      <Typography variant="h5">ตัวแปรสินค้า</Typography>
      <CustomFormLabel sx={{ mt: 2 }}>ชนิดตัวแปร (เช่น ขนาด)</CustomFormLabel>
      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BaseTextField
            name="variant.nameTh"
            formik={formik}
            label="ชื่อ"
            placeholder="เช่น ขนาด"
            fullWidth
            value={variant.nameTh}
            onChange={(e: any) => setVariantField("nameTh", e.target?.value ?? e)}
            lang="th"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <BaseTextField
            name="variant.nameEn"
            formik={formik}
            label="ชื่อ"
            placeholder="e.g. Size"
            fullWidth
            value={variant.nameEn}
            onChange={(e: any) => setVariantField("nameEn", e.target?.value ?? e)}
            lang="en"
          />
        </Grid>
      </Grid>

      <CustomFormLabel sx={{ mt: 3 }}>ตัวเลือกของตัวแปร (เช่น S, M, L)</CustomFormLabel>

      <Stack spacing={2} mt={1}>
        {productOptions.map((opt: any, idx: number) => (
          <Box
            key={idx}
            sx={{
              border: "1px dashed",
              borderColor: "primary.main", // ใช้สี primary (main)
              borderRadius: 1,
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <BaseTextField
                  name={`productOptions[${idx}].variantOption.nameTh`}
                  formik={formik}
                  label="ชื่อตัวเลือก"
                  placeholder="เช่น S"
                  fullWidth
                  value={opt.variantOption?.nameTh ?? ""}
                  onChange={(e: any) => updateOption(idx, "variantOption.nameTh", e.target?.value ?? e)}
                  lang="th"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <BaseTextField
                  name={`productOptions[${idx}].variantOption.nameEn`}
                  formik={formik}
                  label="ชื่อตัวเลือก"
                  placeholder="e.g. S"
                  fullWidth
                  value={opt.variantOption?.nameEn ?? ""}
                  onChange={(e: any) => updateOption(idx, "variantOption.nameEn", e.target?.value ?? e)}
                  lang="en"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <BaseTextField
                  name={`productOptions[${idx}].price`}
                  formik={formik}
                  label="ราคา"
                  placeholder="0.00"
                  type="number"
                  fullWidth
                  value={opt.price ?? 0}
                  onChange={(e: any) => updateOption(idx, "price", Number(e.target?.value ?? 0))}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }} display="flex" justifyContent="flex-end">
                <Tooltip title="ลบตัวเลือก">
                  <IconButton color="error" onClick={() => removeOption(idx)}>
                    <IconX />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <BaseTextField
                  name={`productOptions[${idx}].sku`}
                  formik={formik}
                  label="SKU"
                  placeholder="SKU"
                  fullWidth
                  value={opt.sku ?? ""}
                  onChange={(e: any) => updateOption(idx, "sku", e.target?.value ?? e)}
                  tooltip="รหัสสินค้าที่ใช้ภายในระบบ (SKU) — ใช้ติดตาม/อ้างอิงสินค้า"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <BaseTextField
                  name={`productOptions[${idx}].upc`}
                  formik={formik}
                  label="UPC"
                  placeholder="UPC"
                  fullWidth
                  value={opt.upc ?? ""}
                  onChange={(e: any) => updateOption(idx, "upc", e.target?.value ?? e)}
                  required
                  tooltip="รหัสบาร์โค้ด (UPC/EAN) ของสินค้า — ใส่เพื่อสแกน/เชื่อมต่อกับเครื่องบาร์โค้ด"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <BaseTextField
                  name={`productOptions[${idx}].inventory.stock`}
                  formik={formik}
                  label="จำนวนสต็อก"
                  placeholder="0"
                  type="number"
                  fullWidth
                  value={opt.inventory?.stock ?? 0}
                  onChange={(e: any) => updateOption(idx, "inventory.stock", Number(e.target?.value ?? 0))}
                  tooltip="จำนวนสินค้าที่มีอยู่ในคลังสำหรับตัวเลือกนี้"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <BaseDropdown
                  name={`productOptions[${idx}].inventory.status`}
                  value={opt.inventory?.status ?? "active"}
                  label="สถานะ"
                  onChange={(selected: any) => updateOption(idx, "inventory.status", selected?.value ?? selected)}
                  options={[
                    { value: "active", text: "ใช้งาน" },
                    { value: "inactive", text: "ไม่ใช้งาน" },
                  ]}
                  renderOption={(option: any) => <BaseChip preset={option.value} />}
                  fullWidth
                  tooltip="สถานะการขายของตัวเลือกนี้ (เช่น เปิดใช้งาน/ปิดใช้งาน)"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button variant="text" startIcon={<IconPlus />} onClick={addOption}>
          เพิ่มตัวเลือก
        </Button>

        <Typography variant="body2" color="textSecondary">
          แต่ละตัวเลือกจะกลายเป็น productOptions ใน request body (มี price, sku, upc, inventory)
        </Typography>
      </Stack>
    </Box>
  );
};

export default VariationCard;
