"use client";
import { BaseAutoComplete, BaseButton, BaseDropdown } from "@/common/components/base";
import { CreateProductPayload } from "@/common/contexts/ProductsContext/interfaces/products";
import { FC, useMemo, useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { OptionType } from "@/common/components/base/BaseDropdown";
import { tagOptions as defaultTagOptions } from "@/common/contexts/ProductsContext/constants/constants";
import { useCategories } from "@/common/contexts/CategoriesContext";
import Box from "@mui/material/Box";
import CategoryDialog from "@/app/dashboard/pos/categories/components/CategoryDialog";
import type { FormikProps } from "formik";

const STORAGE_KEY = "meowsom:customTags";

interface CategoryAndTagsProps {
  formik: FormikProps<CreateProductPayload>;
}

const CategoryAndTags: FC<CategoryAndTagsProps> = ({ formik }) => {
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [savedTags, setSavedTags] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedTags(JSON.parse(raw));
    } catch {
      setSavedTags([]);
    }
  }, []);

  useEffect(() => {
    const currentTags: string[] = formik?.values?.tags ?? [];
    if (!currentTags.length) return;
    const unknown = currentTags.filter((t) => !defaultTagOptions.includes(t) && !savedTags.includes(t));
    if (unknown.length) {
      const next = Array.from(new Set([...savedTags, ...unknown]));
      setSavedTags(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    }
  }, [formik?.values?.tags]); 

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

  const autocompleteOptions = useMemo(() => {
    return Array.from(new Set([...defaultTagOptions, ...savedTags]));
  }, [savedTags]);

  const handleTagsChange = (v: string[]) => {
    formik?.setFieldValue("tags", v);
    const newCustom = v.filter((t) => !defaultTagOptions.includes(t) && !savedTags.includes(t));
    if (newCustom.length) {
      const next = Array.from(new Set([...savedTags, ...newCustom]));
      setSavedTags(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5">หมวดหมู่ และ แท็ก</Typography>
      <Grid container mt={3}>
        <Grid size={12}>
          <BaseDropdown
            formik={formik}
            name="categoryId"
            label="หมวดหมู่"
            placeholder="เลือกหมวดหมู่"
            value={categoryValue}
            options={categoryOptions}
            fullWidth
            groupBy={(opt) => (opt as any).group || ""}
            onChange={(val: any) => {
              formik.setFieldValue("categoryId", val);
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
            options={autocompleteOptions}
            placeholder="Tags"
            fullWidth
            openOnFocus
            filterSelectedOptions
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            onChange={(v: string[]) => handleTagsChange(v)}
          />
        </Grid>
      </Grid>

      <CategoryDialog open={openCreateCategory} onClose={() => setOpenCreateCategory(false)} type="create" />
    </Box>
  );
};

export default CategoryAndTags;
