"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Autocomplete, Button, Grid, Typography } from "@mui/material";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import BaseTextField from "@/common/components/base/BaseTextField";
import { IconPlus } from "@tabler/icons-react";

interface ProductDetailsProps {
  formik?: any;
}

const new_category = [
  { label: "Computer" },
  { label: "Watches" },
  { label: "Headphones" },
  { label: "Beauty" },
  { label: "Fashion" },
  { label: "Footwear" },
];

const new_tags = [
  { label: "New" },
  { label: "Trending" },
  { label: "Footwear" },
  { label: "Latest" },
];

const ProductDetails: React.FC<ProductDetailsProps> = ({ formik }) => {
  const categories = formik?.values?.categories ?? [];
  const tags = formik?.values?.tags ?? [];

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
          <Autocomplete
            multiple
            fullWidth
            id="new-category"
            options={new_category}
            value={categories}
            onChange={(_, v) => {
              if (formik) formik.setFieldValue("categories", v);
            }}
            getOptionLabel={(option) => (option as any).label}
            filterSelectedOptions
            renderInput={(params) => (
              <BaseTextField {...params} placeholder="Categories" name="categories" formik={formik} />
            )}
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
