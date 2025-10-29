"use client";
import React from "react";

// MUI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { IconX } from "@tabler/icons-react";

// Base Components
import BaseTextField from "@/common/components/base/BaseTextField";
import ProductOptionFields from "./ProductOptionFields";

type Props = {
  idx: number;
  formik: any;
  removeOption: (index: number) => void;
};

const OptionItem: React.FC<Props> = ({ idx, formik, removeOption }) => {
  const optionPath = `productOptions[${idx}]`;
  const productOptionsCount = formik.values.productOptions?.length ?? 0;

  return (
    <Box sx={{ position: "relative", border: "1px dashed", borderColor: "primary.main", borderRadius: 1, p: 2 }}>
      {productOptionsCount > 1 && (
        <Tooltip title="ลบตัวเลือก">
          <IconButton
            color="error"
            size="medium"
            onClick={() => removeOption(idx)}
            aria-label="remove-option"
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
          >
            <IconX />
          </IconButton>
        </Tooltip>
      )}

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <BaseTextField formik={formik} name={`${optionPath}.variantOption.nameTh`} label="ชื่อตัวเลือก" placeholder="เช่น S" lang="th" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BaseTextField formik={formik} name={`${optionPath}.variantOption.nameEn`} label="ชื่อตัวเลือก" placeholder="e.g. S" lang="en" fullWidth />
        </Grid>
      </Grid>

      <Box mt={2}>
        <ProductOptionFields formik={formik} optionPath={optionPath} />
      </Box>
    </Box>
  );
};

export default OptionItem;
