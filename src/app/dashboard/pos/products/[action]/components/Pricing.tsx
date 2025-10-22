"use client";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import BaseDropdown, { OptionType } from "@/common/components/base/BaseDropdown";
import BaseRadio from "@/common/components/base/BaseRadio";
import BaseTextField from "@/common/components/base/BaseTextField";
import Box from "@mui/material/Box";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import BaseSlider from "@/common/components/base/BaseSlider";
import React from "react";

interface PricingCardProps {
  formik?: any;
}

const PricingCard: React.FC<PricingCardProps> = ({ formik }) => {
  const taxClassOptions: OptionType[] = [
    { text: "Tax Free", value: "tax_free" },
    { text: "Taxable Goods", value: "taxable" },
    { text: "Downloadable Products", value: "downloadable" },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        ส่วนราคา และ ภาษี
      </Typography>
      <Grid container columnSpacing={3}>
        <Grid size={{ xs: 12 }}>
          <BaseRadio
            formik={formik}
            name="discountType"
            label="ประเภทส่วนลด"
            required
            variant="card"
            options={[
              { value: "no_discount", label: "ไม่มีส่วนลด" },
              { value: "percentage", label: "เปอร์เซ็นต์ %" },
              { value: "fixed", label: "ราคาคงที่" },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          {formik?.values?.discountType === "percentage" && (
            <>
              <BaseSlider
                formik={formik}
                name="discountPercent"
                label="ตั้งเปอร์เซ็นต์ส่วนลด"
                required
                mode="percent"
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
              />
            </>
          )}

          {formik?.values?.discountType === "fixed" && (
            <BaseTextField
              name="p_fixed"
              label="ราคาหลังหักส่วนลดแบบคงที่"
              required
              formik={formik}
              placeholder="Discounted Price"
              fullWidth
              type="number"
            />
          )}
        </Grid>

        {/* tax fields moved to VariationCard */}
      </Grid>
    </Box>
  );
};

export default PricingCard;
