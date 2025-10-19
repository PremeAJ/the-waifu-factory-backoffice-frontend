"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button, Grid, Tooltip, MenuItem } from "@mui/material";
import { Typography } from "@mui/material";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import BaseTextField from "@/common/components/base/BaseTextField";
import { IconX } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import CustomSelect from "@/components/forms/theme-elements/CustomSelect";

interface VariationCardProps {
  formik?: any;
}

const VariationCard: React.FC<VariationCardProps> = ({ formik }) => {
  const formValue = formik?.values?.variationType ?? "0";
  const [age, setAge] = useState<string>(formValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = event.target.value;
    setAge(v);
    if (formik) formik.setFieldValue("variationType", v);
  };

  const variationValue = formik?.values?.variationValue ?? "";

  return (
    <Box p={3}>
      <Typography variant="h5">ตัวแปรสินค้า</Typography>
      <CustomFormLabel sx={{ mt: 3 }}>เพิ่มตัวแปรสินค้า</CustomFormLabel>
      <Grid container spacing={3} mb={2}>
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <CustomSelect id="variationType" value={age} onChange={handleChange} fullWidth>
            <MenuItem value={"0"}>Size</MenuItem>
            <MenuItem value={"XS"}>XS</MenuItem>
            <MenuItem value={"SM"}>SM</MenuItem>
            <MenuItem value={"MD"}>MD</MenuItem>
            <MenuItem value={"LG"}>LG</MenuItem>
            <MenuItem value={"XL"}>XL</MenuItem>
          </CustomSelect>
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <BaseTextField
            name="variationValue"
            formik={formik}
            value={variationValue}
            onChange={(e: any) => {
              if (formik) formik.setFieldValue("variationValue", e.target?.value ?? e);
            }}
            placeholder="Variations"
            fullWidth
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Tooltip title="Delete">
            <Button color="error" aria-label="delete">
              <IconX size={21} />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Button
        variant="text"
        startIcon={<IconPlus size={18} />}
        onClick={() => {
          // example: append variation to array in formik
          if (formik) {
            const list = formik.values.variations || [];
            formik.setFieldValue("variations", [...list, { type: age, value: variationValue }]);
            formik.setFieldValue("variationValue", "");
          }
        }}
      >
        เพิ่มชุดตัวแปรอีกชุด
      </Button>
    </Box>
  );
};

export default VariationCard;
