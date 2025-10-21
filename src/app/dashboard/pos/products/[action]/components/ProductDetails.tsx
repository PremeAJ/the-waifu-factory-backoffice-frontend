"use client";
import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import { Autocomplete, Button, Grid, Typography } from "@mui/material";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import BaseTextField from "@/common/components/base/BaseTextField";
import { IconPlus } from "@tabler/icons-react";
import BaseDropdown, { OptionType } from "@/common/components/base/BaseDropdown";
import { useCategories } from "@/common/contexts/CategoriesContext";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";

interface ProductDetailsProps {
  formik?: any;
}

const new_tags = [
  { label: "New" },
  { label: "Trending" },
  { label: "Footwear" },
  { label: "Latest" },
];

const ProductDetails: React.FC<ProductDetailsProps> = ({ formik }) => {
  // เก็บเป็น array ของ categoryId
  const categoryIds: string[] = Array.isArray(formik?.values?.categories) ? formik.values.categories : [];
  const tags = formik?.values?.tags ?? [];
  const { dropdown: categoryDropdown } = useCategories();

  // แปลง dropdown -> OptionType[] และจัดกลุ่มตามหมวดหลัก
  const categoryOptions: OptionType[] = useMemo(() => {
    if (!categoryDropdown) return [];
    const opts: OptionType[] = [];
    categoryDropdown.forEach((cat: any) => {
      console.log("🚀 ~ ProductDetails ~ cat:", cat)
      const parentText = `${cat.nameTh}${cat.nameEn ? ` (${cat.nameEn})` : ""}`;
      if (Array.isArray(cat.subCategories) && cat.subCategories.length > 0) {
        cat.subCategories.forEach((sub: any) => {
          opts.push({
            value: sub.id,
            text: `${sub.nameTh}${sub.nameEn ? ` (${sub.nameEn})` : ""}`,
            icon: sub.icon || null,
            // ใช้ groupBy ด้วย key 'group' (ไม่บังคับใน type)
            // @ts-ignore
            group: parentText,
          });
        });
      } else {
        opts.push({
          value: cat.id,
          text: parentText,
          icon: cat.icon || null,
          // @ts-ignore
          group: "หมวดหมู่หลัก",
        });
      }
    });
    return opts;
  }, [categoryDropdown]);

  return (
    <Box p={3}>
      <Typography variant="h5">หมวดหมู่ และ แท็ก</Typography>
      <Grid container mt={3}>
        <Grid display="flex" alignItems="center" size={12}>
          <CustomFormLabel htmlFor="p_cat" sx={{ mt: 0 }}>
            หมวดหมู่
          </CustomFormLabel>
        </Grid>
        <Grid size={12}>
          <BaseDropdown
            formik={formik}
            name="categories"
            label=""
            placeholder="เลือกหมวดหมู่"
            multiple
            // ควบคุมค่าให้เป็น string[] เสมอ (กัน undefined)
            value={categoryIds}
            options={categoryOptions}
            fullWidth
            // แสดงกลุ่มตามหมวดหลัก
            groupBy={(opt) => (opt as any).group || ""}
            // แสดงรายการพร้อม icon
            renderOption={(opt) => (
              <Box display="flex" alignItems="center" gap={1}>
                {opt.icon ? renderTablerIcon(opt.icon, { size: 16 }) : null}
                {opt.text}
              </Box>
            )}
            // ให้ Select แสดงชื่อแทน id เมื่อเลือกหลายรายการ
            renderValue={(selected) => {
              const ids = (selected as string[]) || [];
              if (!ids.length) return "เลือกหมวดหมู่";
              const map = new Map(categoryOptions.map((o) => [o.value, o.text]));
              return ids.map((id) => map.get(id) || id).join(", ");
            }}
          />
          <Typography variant="body2" mb={2}>
            เพิ่มสินค้าลงในหมวดหมู่
          </Typography>
        </Grid>
        <Grid size={12}>
          <Button variant="text" startIcon={<IconPlus size={18} />}>
            สร้างหมวดหมู่ใหม่
          </Button>
        </Grid>

        <Grid display="flex" alignItems="center" size={12}>
          <CustomFormLabel htmlFor="p_tag">แท็ก</CustomFormLabel>
        </Grid>
        <Grid size={12}>
          <Autocomplete
            multiple
            fullWidth
            id="new-tags"
            options={new_tags}
            value={tags}
            onChange={(_, v) => {
              if (formik) formik.setFieldValue("tags", v);
            }}
            getOptionLabel={(option) => (option as any).label}
            filterSelectedOptions
            renderInput={(params) => <BaseTextField {...params} placeholder="Tags" name="tags" formik={formik} />}
          />
          <Typography variant="body2" mb={2}>
            เพิ่มแท็กให้สินค้านี้
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
