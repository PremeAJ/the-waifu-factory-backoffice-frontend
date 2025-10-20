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

type Props = {
  idx: number;
  opt: any;
  formik: any;
  updateOption: (index: number, path: string, value: any) => void;
  removeOption: (index: number) => void;
};

const OptionItem: React.FC<Props> = ({ idx, opt, formik, updateOption, removeOption }) => {
  return (
    <Box sx={{ border: "1px dashed", borderColor: "primary.main", borderRadius: 1, p: 2 }}>
      <Grid container columnSpacing={2} alignItems="center">
        {/* Row 1: ชื่อตัวเลือก (ไทย) | ชื่อตัวเลือก (อังกฤษ) | delete */}
        <Grid size={{ xs: 12, md: 5 }}>
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

        <Grid size={{ xs: 12, md: 5 }}>
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

        <Grid size={{ xs: 12, md: 2 }} display="flex" justifyContent="flex-end">
          <Tooltip title="ลบตัวเลือก">
            <IconButton color="error" onClick={() => removeOption(idx)} size="large">
              <IconX />
            </IconButton>
          </Tooltip>
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

        {/* Row 3: ราคา | จำนวนสต็อก | สถานะ */}
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
            tooltip="จำนวนสินค้าที่มีอยู่ในคลังสำหรับตัวเลือกนี้"
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
    </Box>
  );
};

export default OptionItem;