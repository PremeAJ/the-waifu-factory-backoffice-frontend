"use client";
import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { IconX } from "@tabler/icons-react";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseChip from "@/common/components/base/BaseChip";
import BaseSlider from "@/common/components/base/BaseSlider";
import BaseRadio from "@/common/components/base/BaseRadio";

type Props = {
  idx: number;
  opt: any;
  formik: any;
  updateOption: (index: number, path: string, value: any) => void;
  removeOption: (index: number) => void;
};

const OptionItem: React.FC<Props> = ({ idx, opt, formik, updateOption, removeOption }) => {
  // compute final price after discount and VAT
  const priceBase = Number(opt?.price ?? formik?.values?.productOptions?.[idx]?.price ?? 0);
  const discountType = formik?.values?.productOptions?.[idx]?.discountType;
  const discountPercent = Number(formik?.values?.productOptions?.[idx]?.discountPercent ?? 0);
  const discountValue = Number(formik?.values?.productOptions?.[idx]?.discountValue ?? 0);
  const vat = Number(formik?.values?.p_vat ?? 0);
  const calcAfterDiscount = () => {
    let v = priceBase;
    if (discountType === "percentage") v = v * (1 - discountPercent / 100);
    else if (discountType === "fixed") v = v - discountValue;
    if (v < 0) v = 0;
    return v;
  };
  const finalPrice = (() => {
    const afterDisc = calcAfterDiscount();
    return Number((afterDisc * (1 + vat / 100)).toFixed(2));
  })();

  return (
    <Box sx={{ position: "relative", border: "1px dashed", borderColor: "primary.main", borderRadius: 1, p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Row 1: ชื่อตัวเลือก (ไทย) | ชื่อตัวเลือก (อังกฤษ) */}
        <Grid size={{ xs: 12, md: 6 }}>
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

        <Grid size={{ xs: 12, md: 6 }}>
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

        {/* Row 2: UPC | SKU */}
        <Grid size={{ xs: 12, md: 6 }}>
          <BaseTextField
            name={`productOptions[${idx}].upc`}
            formik={formik}
            label="UPC"
            placeholder="UPC"
            fullWidth
            value={opt.upc ?? ""}
            onChange={(e: any) => updateOption(idx, "upc", e.target?.value ?? e)}
            required
            tooltip="รหัสบาร์โค้ด (UPC/EAN)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <BaseTextField
            name={`productOptions[${idx}].sku`}
            formik={formik}
            label="SKU"
            placeholder="SKU"
            fullWidth
            value={opt.sku ?? ""}
            onChange={(e: any) => updateOption(idx, "sku", e.target?.value ?? e)}
            tooltip="รหัสสินค้าที่ใช้ภายในระบบ (SKU)"
          />
        </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
          <BaseRadio
            formik={formik}
            name={`productOptions[${idx}].discountType`}
            label="ประเภทส่วนลด"
            variant="card"
            options={[
              { value: "no_discount", label: "ไม่มีส่วนลด" },
              { value: "percentage", label: "เปอร์เซ็นต์ %" },
              { value: "fixed", label: "ราคาคงที่" },
            ]}
          />
        </Grid>
        {formik?.values?.productOptions?.[idx]?.discountType === "percentage" && (
          <Grid size={{ xs: 12, md: 12 }}>
            <BaseSlider
              formik={formik}
              name={`productOptions[${idx}].discountPercent`}
              label="เปอร์เซ็นต์ส่วนลด"
              mode="percent"
              min={0}
              max={100}
              step={1}
            />
          </Grid>
        )}
        {formik?.values?.productOptions?.[idx]?.discountType === "fixed" && (
          <Grid size={{ xs: 12, md: 12 }}>
            <BaseTextField
              name={`productOptions[${idx}].discountValue`}
              label="มูลค่าส่วนลด (คงที่)"
              formik={formik}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
            />
          </Grid>
        )}

        {/* Row 3: ราคาพื้นฐาน | ราคาหลังหักส่วนลดและภาษี | จำนวนสต็อก | สถานะ */}
        <Grid size={{ xs: 12, md: 3 }}>
          <BaseTextField
            name={`productOptions[${idx}].price`}
            formik={formik}
            label="ราคาพื้นฐาน"
            placeholder="0.00"
            type="number"
            fullWidth
            value={opt.price ?? 0}
            onChange={(e: any) => updateOption(idx, "price", Number(e.target?.value ?? 0))}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <BaseTextField
            name={`productOptions[${idx}].price_final`}
            formik={formik}
            label="ราคาหลังหักส่วนลดและภาษี"
            placeholder="0.00"
            type="number"
            fullWidth
            value={finalPrice}
            disabled
            inputProps={{ step: 0.01 }}
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
          />
        </Grid>
      </Grid>

      {/* keep delete button outside Grid DOM flow (absolute, no layout shift) */}
      <Tooltip title="ลบตัวเลือก">
        <IconButton
          color="error"
          onClick={() => removeOption(idx)}
          size="medium"
          aria-label="remove-option"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            width: 36,
            height: 36,
            boxShadow: 1,
            bgcolor: "background.paper",
            "&:hover": { bgcolor: "error.light" },
          }}
        >
          <IconX />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default OptionItem;