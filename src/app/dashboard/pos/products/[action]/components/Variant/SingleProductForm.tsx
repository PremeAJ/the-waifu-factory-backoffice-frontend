"use client";
import React from "react";
import { Grid } from "@mui/material";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseChip from "@/common/components/base/BaseChip";
import BaseRadio from "@/common/components/base/BaseRadio";
import BaseSlider from "@/common/components/base/BaseSlider";

type Props = {
  formik: any;
  productOptions: any[];
  updateOption: (index: number, path: string, value: any) => void;
};

const SingleProductForm: React.FC<Props> = ({ formik, productOptions, updateOption }) => {
  const opt = productOptions[0] ?? { upc: "", sku: "", price: 0, inventory: { status: "active", stock: 0 } };
  const idx = 0;

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
    <>
      <Grid container columnSpacing={2} alignItems="center" sx={{ mb: 1 }}>
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

        <Grid size={{ xs: 12, md: 6 }}>
          <BaseTextField
            name={`productOptions[${idx}].upc`}
            formik={formik}
            label="UPC"
            placeholder="UPC"
            fullWidth
            value={opt.upc ?? ""}
            onChange={(e: any) => updateOption(idx, "upc", e.target?.value ?? e)}
            tooltip="รหัสบาร์โค้ด (UPC/EAN)"
          />
        </Grid>
      </Grid>

      <Grid container columnSpacing={2} alignItems="center">
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

        <Grid size={{ xs: 6, md: 3 }}>
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

        <Grid size={{ xs: 6, md: 3 }}>
          <BaseTextField
            name={`productOptions[${idx}].price_final`}
            formik={formik}
            label="ราคาหลังคำนวน"
            placeholder="0.00"
            type="number"
            fullWidth
            value={finalPrice}
            disabled
            inputProps={{ step: 0.01 }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <BaseTextField
            name={`productOptions[${idx}].inventory.stock`}
            formik={formik}
            label="จำนวนสต็อก"
            placeholder="0"
            type="number"
            fullWidth
            value={opt.inventory?.stock ?? 0}
            onChange={(e: any) => updateOption(idx, "inventory.stock", Number(e.target?.value ?? 0))}
            tooltip="จำนวนสินค้าที่มีอยู่ในคลัง"
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
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
            renderValue={(selected: any) => <BaseChip preset={selected?.value ?? selected} />}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SingleProductForm;
