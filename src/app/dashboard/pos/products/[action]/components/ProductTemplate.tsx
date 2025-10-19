"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Grid, MenuItem, Typography } from "@mui/material";
import CustomSelect from "@/components/forms/theme-elements/CustomSelect";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";

interface ProductTemplateProps {
  formik?: any;
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ formik }) => {
  const initial = formik?.values?.productTemplate ?? "0";
  const [age, setAge] = useState<string>(initial);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge(event.target.value);
    if (formik) formik.setFieldValue("productTemplate", event.target.value);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        แม่แบบสินค้า
      </Typography>
      <Grid container spacing={3}>
        <Grid size={12}>
          <CustomFormLabel htmlFor="productTemplate" sx={{ mt: 0 }}>
            เลือกแม่แบบสินค้า
          </CustomFormLabel>
          <CustomSelect id="productTemplate" value={age} onChange={handleChange} fullWidth>
            <MenuItem value={"0"}>แม่แบบเริ่มต้น</MenuItem>
            <MenuItem value={"fashion"}>แฟชั่น</MenuItem>
            <MenuItem value={"office"}>เครื่องเขียน</MenuItem>
            <MenuItem value={"electronics"}>อิเล็กทรอนิกส์</MenuItem>
          </CustomSelect>
          <Typography variant="body2" mt={1}>
            Assign a template from your current theme to define how a single product is displayed.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductTemplate;
