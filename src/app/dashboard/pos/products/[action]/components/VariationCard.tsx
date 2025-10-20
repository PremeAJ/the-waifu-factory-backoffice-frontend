"use client";
import {  IconTag, IconStack } from "@tabler/icons-react";
import { Grid,Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BaseTabs from "@/common/components/base/BaseTabs";
import BaseTextField from "@/common/components/base/BaseTextField";
import Box from "@mui/material/Box";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import React from "react";
import SingleProductForm from "./Variant/SingleProductForm";
import VariantOptionsList from "./Variant/VariantOptionsList";

interface VariationCardProps {
  formik?: any;
}

const emptyOption = () => ({
  upc: "",
  sku: "",
  price: 0,
  variantOption: { nameTh: "", nameEn: "" },
  inventory: { status: "active", stock: 0 },
});

const VariationCard: React.FC<VariationCardProps> = ({ formik }) => {
  const theme = useTheme();
  const tabs = [
    { label: "ไม่มีตัวแปร", icon: <IconTag width={18} color={theme.palette.text.secondary} /> },
    { label: "มีตัวแปร", icon: <IconStack width={18} color={theme.palette.primary.main} /> },
  ];

  const [tab, setTab] = React.useState<number>(() => {
    const hasVariant = Boolean(formik?.values?.variant) || (formik?.values?.productOptions || []).some((o: any) => o?.variantOption);
    return hasVariant ? 1 : 0;
  });

  const handleTabChange = (_: React.SyntheticEvent, v: number) => {
    setTab(v);
    if (!formik) return;
    const productOptions = formik.values.productOptions || [];
    if (v === 0) {
      const base = productOptions[0] || emptyOption();
      const single = { upc: base.upc ?? "", sku: base.sku ?? "", price: base.price ?? 0, inventory: base.inventory ?? { status: "active", stock: 0 } };
      formik.setFieldValue("variant", undefined);
      formik.setFieldValue("productOptions", [single]);
    } else {
      const variant = formik.values.variant ?? { nameTh: "", nameEn: "" };
      const opts = (productOptions.length ? productOptions : [emptyOption()]).map((o: any) => ({ ...o, variantOption: o.variantOption ?? { nameTh: "", nameEn: "" } }));
      formik.setFieldValue("variant", variant);
      formik.setFieldValue("productOptions", opts);
    }
  };

  const variant = formik?.values?.variant ?? { nameTh: "", nameEn: "" };
  const productOptions = formik?.values?.productOptions ?? [];

  const setVariantField = (field: string, value: any) => formik?.setFieldValue(`variant.${field}`, value);
  const addOption = () => formik && formik.setFieldValue("productOptions", [...productOptions, emptyOption()]);
  const removeOption = (index: number) => {
    if (!formik) return;
    const next = productOptions.slice();
    next.splice(index, 1);
    formik.setFieldValue("productOptions", next);
  };
  const updateOption = (index: number, path: string, value: any) => {
    if (!formik) return;
    const next = productOptions.slice();
    const parts = path.split(".");
    if (!next[index]) next[index] = {};
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
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">รายละเอียดสินค้า</Typography>
        <BaseTabs value={tab} onChange={handleTabChange} tabs={tabs} />
      </Box>

      {tab === 0 ? (
        <>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            ข้อมูลสินค้า (ไม่มีตัวแปร)
          </Typography>
          <SingleProductForm formik={formik} productOptions={productOptions} updateOption={updateOption} />
        </>
      ) : (
        <>
          <CustomFormLabel sx={{ mt: 2 }}>ชนิดตัวแปร (เช่น ขนาด)</CustomFormLabel>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="variant.nameTh" formik={formik} label="ชื่อ" placeholder="เช่น ขนาด" fullWidth value={variant.nameTh} onChange={(e: any) => setVariantField("nameTh", e.target?.value ?? e)} lang="th" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseTextField name="variant.nameEn" formik={formik} label="ชื่อ" placeholder="e.g. Size" fullWidth value={variant.nameEn} onChange={(e: any) => setVariantField("nameEn", e.target?.value ?? e)} lang="en" />
            </Grid>
          </Grid>

          <CustomFormLabel sx={{ mt: 3 }}>ตัวเลือกของตัวแปร (เช่น S, M, L)</CustomFormLabel>
          <VariantOptionsList formik={formik} productOptions={productOptions} updateOption={updateOption} addOption={addOption} removeOption={removeOption} />
        </>
      )}
    </Box>
  );
};

export default VariationCard;
