"use client";
import React from "react";
import { Grid } from "@mui/material";
import BaseTextField from "@/common/components/base/BaseTextField";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseChip from "@/common/components/base/BaseChip";

type Props = {
  formik: any;
  productOptions: any[];
  updateOption: (index: number, path: string, value: any) => void;
};

const SingleProductForm: React.FC<Props> = ({ formik, productOptions, updateOption }) => {
  const opt = productOptions[0] ?? { upc: "", sku: "", price: 0, inventory: { status: "active", stock: 0 } };
  const idx = 0;

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

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
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

        <Grid size={{ xs: 12, md: 4 }}>
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

        <Grid size={{ xs: 12, md: 4 }}>
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
    </>
  );
};

export default SingleProductForm;