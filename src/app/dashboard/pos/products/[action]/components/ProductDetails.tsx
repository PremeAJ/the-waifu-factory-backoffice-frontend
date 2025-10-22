"use client";
import { Button, Grid, Typography } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseAutoComplete from "@/common/components/base/BaseAutoComplete";
import BaseDropdown, { OptionType } from "@/common/components/base/BaseDropdown";
import Box from "@mui/material/Box";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import React, { useMemo, useState } from "react";
import type { FormikProps } from "formik";
import type { ProductFormValues } from "@/common/contexts/ProductsContext/interfaces/products";
import { tagOptions } from "@/common/contexts/ProductsContext/constants";
import BaseButton from "@/common/components/base/BaseButton";
import CategoryDialog from "@/app/dashboard/pos/categories/components/CategoryDialog";

interface ProductDetailsProps {
  formik: FormikProps<ProductFormValues>;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ formik }) => {
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const categoryIds: string[] = Array.isArray(formik?.values?.categories) ? formik.values.categories : [];
  const tags: string[] = Array.isArray(formik?.values?.tags)
    ? (formik.values.tags as any[]).map((t) => (typeof t === "string" ? t : t?.label || "")).filter(Boolean)
    : [];
  const { dropdown: categoryDropdown } = useCategories();
  const categoryOptions: OptionType[] = useMemo(() => {
    if (!categoryDropdown) return [];
    const opts: OptionType[] = [];

    categoryDropdown.forEach((cat: any) => {
      const parentText = `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`;
      opts.push({
        value: cat.id,
        text: parentText,
        icon: cat.icon || null,
        group: "หมวดหมู่หลัก",
      });

      if (Array.isArray(cat.subCategories) && cat.subCategories.length > 0) {
        cat.subCategories.forEach((sub: any) => {
          opts.push({
            value: sub.id,
            text: `${sub.nameTh}${sub.nameEn ? ` (${sub.nameEn})` : ""}`,
            icon: sub.icon || null,
            group: parentText,
          });
        });
      }
    });

    return opts;
  }, [categoryDropdown]);

  return (
    <Box p={3}>
      <Typography variant="h5">หมวดหมู่ และ แท็ก</Typography>
      <Grid container mt={3}>
        <Grid size={12}>
          <BaseDropdown
            formik={formik}
            name="categories"
            label="หมวดหมู่"
            placeholder="เลือกหมวดหมู่"
            value={categoryIds}
            options={categoryOptions}
            fullWidth
            groupBy={(opt) => (opt as any).group || ""}
            renderOption={(opt) => (
              <Box display="flex" alignItems="center" gap={1}>
                {opt.icon ? renderTablerIcon(opt.icon, { size: 16 }) : null}
                {opt.text}
              </Box>
            )}
            renderValue={(selected) => {
              const ids = (selected as string[]) || [];
              if (!ids.length) return "เลือกหมวดหมู่";
              const map = new Map(categoryOptions.map((o) => [o.value, o.text]));
              return ids.map((id) => map.get(id) || id).join(", ");
            }}
          />
        </Grid>
        <Grid size={12} mt={2}>
          <BaseButton
            label='สร้างหมวดหมู่ใหม่'
            startIcon={<IconPlus/>}
            size='small'
            fullWidth={false}
            variant="text"
            onClick={() => setOpenCreateCategory(true)}
          />
        </Grid>

        <Grid size={12}>
          <BaseAutoComplete
            name="tags"
            label='แท็ก'
            formik={formik}
            multiple
            freeSolo
            options={tagOptions}
            placeholder="Tags"
            fullWidth
            openOnFocus
            filterSelectedOptions
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            value={tags}
            onChange={(v: string[]) => formik?.setFieldValue("tags", v)}
          />
        </Grid>
      </Grid>

      {/* Dialog สร้างหมวดหมู่ */}
      <CategoryDialog
        open={openCreateCategory}
        onClose={() => setOpenCreateCategory(false)}
        type="create"
      />
    </Box>
  );
};

export default ProductDetails;
