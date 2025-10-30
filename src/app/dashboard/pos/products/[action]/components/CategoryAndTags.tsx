"use client";
import { CreateProductPayload } from "@/common/contexts/ProductsContext/interfaces/products";
import { Grid, Typography } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { useCategories } from "@/common/contexts/CategoriesContext";
import BaseAutoComplete from "@/common/components/base/BaseAutoComplete";
import BaseButton from "@/common/components/base/BaseButton";
import BaseDropdown, { OptionType } from "@/common/components/base/BaseDropdown";
import Box from "@mui/material/Box";
import CategoryDialog from "@/app/dashboard/pos/categories/components/CategoryDialog";
import React, { useMemo, useState } from "react";
import type { FormikProps } from "formik";
import { tagOptions } from "@/common/contexts/ProductsContext/constants/constants";

interface CategoryAndTagsProps {
  formik: FormikProps<CreateProductPayload>;
}

const CategoryAndTags: React.FC<CategoryAndTagsProps> = ({ formik }) => {
  const [openCreateCategory, setOpenCreateCategory] = useState(false);

  const categoryValue: string = (() => {
    const v = formik?.values?.categoryId;
    if (Array.isArray(v)) return String(v[0] ?? "");
    return v != null ? String(v) : "";
  })();

  const { dropdown: categoryDropdown } = useCategories();

  const categoryOptions: OptionType[] = useMemo(() => {
    if (!categoryDropdown) return [];
    const opts: OptionType[] = [];

    categoryDropdown.forEach((cat: any) => {
      const parentText = `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`;
      opts.push({
        // normalize to string for single-select matching
        value: String(cat.id),
        text: parentText,
        icon: cat.icon || null,
        group: "หมวดหมู่หลัก",
      });

      if (Array.isArray(cat.subCategories) && cat.subCategories.length > 0) {
        cat.subCategories.forEach((sub: any) => {
          opts.push({
            value: String(sub.id),
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
            value={categoryValue}
            options={categoryOptions}
            fullWidth
            groupBy={(opt) => (opt as any).group || ""}
            onChange={(val: any) => {
              formik.setFieldValue("categories", val);
            }}
          />
        </Grid>

        <Grid size={12} mt={2}>
          <BaseButton
            label="สร้างหมวดหมู่ใหม่"
            startIcon={<IconPlus />}
            size="small"
            fullWidth={false}
            variant="outlined"
            onClick={() => setOpenCreateCategory(true)}
          />
        </Grid>

        <Grid size={12}>
          <BaseAutoComplete
            name="tags"
            label="แท็ก"
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
            // value={tags}
            onChange={(v: string[]) => formik?.setFieldValue("tags", v)}
          />
        </Grid>
      </Grid>

      <CategoryDialog open={openCreateCategory} onClose={() => setOpenCreateCategory(false)} type="create" />
    </Box>
  );
};

export default CategoryAndTags;
