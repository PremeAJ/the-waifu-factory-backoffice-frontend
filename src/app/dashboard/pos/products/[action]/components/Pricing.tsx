"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Typography, FormControlLabel, RadioGroup, Stack, useTheme, ButtonBase } from "@mui/material";
import { Grid, MenuItem } from "@mui/material";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import BaseTextField from "@/common/components/base/BaseTextField";
import CustomSelect from "@/components/forms/theme-elements/CustomSelect";
import CustomRadio from "@/components/forms/theme-elements/CustomRadio";
import CustomSlider from "@/components/forms/theme-elements/CustomSlider";

interface PricingCardProps {
  formik?: any;
}

const PricingCard: React.FC<PricingCardProps> = ({ formik }) => {
  const theme = useTheme();
  const initialTax = formik?.values?.taxClass ?? "0";
  const [taxClass, setTaxClass] = useState<string>(initialTax);
  const [selectedValue, setSelectedValue] = useState<string>(formik?.values?.discountType ?? "no_discount");
  const [value3, setValue3] = React.useState<number>(formik?.values?.discountPercent ?? 30);

  const handleTaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaxClass(event.target.value);
    if (formik) formik.setFieldValue("taxClass", event.target.value);
  };

  const setDiscount = (val: string) => {
    setSelectedValue(val);
    if (formik) formik.setFieldValue("discountType", val);
  };

  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(event.target.value);
  };

  const handleChange6 = (_event: Event, newValue: number | number[]) => {
    const next = Array.isArray(newValue) ? newValue[0] : newValue;
    setValue3(next);
    if (formik) formik.setFieldValue("discountPercent", next);
  };

  const cardSx = (active: boolean) => ({
    px: 2,
    py: 1,
    flexGrow: 1,
    textAlign: "center",
    border: `1px dashed ${active ? theme.palette.primary.main : theme.palette.divider}`,
    bgcolor: active ? theme.palette.action.selected : "transparent",
    borderRadius: 1,
  });

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        การตั้งราคา
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <CustomFormLabel htmlFor="p_price" sx={{ mt: 0 }}>
            ราคาพื้นฐาน{" "}
            <Typography color="error.main" component="span">
              *
            </Typography>
          </CustomFormLabel>
          <BaseTextField name="p_price" formik={formik} placeholder="Product Price" fullWidth type="number" />
        </Grid>

          <Grid size={{ xs: 12 }}>
          <CustomFormLabel htmlFor="discountType" sx={{ mt: 0 }}>
            ประเภทส่วนลด{" "}
            <Typography color="error.main" component="span">
              *
            </Typography>
          </CustomFormLabel>

          <RadioGroup
            row
            name="discountType"
            value={selectedValue}
            onChange={handleValue}
            sx={{ width: "100%" }} // <-- ensure RadioGroup full width
          >
            <Grid container spacing={2} sx={{ width: "100%" }}>
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
                <ButtonBase onClick={() => setDiscount("no_discount")} sx={{ width: "100%", height: "100%" }}>
                  <Box sx={{ ...cardSx(selectedValue === "no_discount"), height: "100%" }}>
                    <FormControlLabel
                      value="no_discount"
                      control={<CustomRadio />}
                      label="ไม่มีส่วนลด"
                      sx={{ width: "100%", justifyContent: "center", pointerEvents: "none" }}
                    />
                  </Box>
                </ButtonBase>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
                <ButtonBase onClick={() => setDiscount("percentage")} sx={{ width: "100%", height: "100%" }}>
                  <Box sx={{ ...cardSx(selectedValue === "percentage"), height: "100%" }}>
                    <FormControlLabel
                      value="percentage"
                      control={<CustomRadio />}
                      label="เปอร์เซ็นต์ %"
                      sx={{ width: "100%", justifyContent: "center", pointerEvents: "none" }}
                    />
                  </Box>
                </ButtonBase>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
                <ButtonBase onClick={() => setDiscount("fixed")} sx={{ width: "100%", height: "100%" }}>
                  <Box sx={{ ...cardSx(selectedValue === "fixed"), height: "100%" }}>
                    <FormControlLabel
                      value="fixed"
                      control={<CustomRadio />}
                      label="ราคาคงที่"
                      sx={{ width: "100%", justifyContent: "center", pointerEvents: "none" }}
                    />
                  </Box>
                </ButtonBase>
              </Grid>
            </Grid>
          </RadioGroup>

          {selectedValue === "percentage" && (
            <>
              <CustomFormLabel>
                ตั้งเปอร์เซ็นต์ส่วนลด{" "}
                <Typography color="error.main" component="span">
                  *
                </Typography>
              </CustomFormLabel>
              <CustomSlider aria-label="Volume" value={value3} onChange={handleChange6} />
              <Typography variant="body2">ตั้งเปอร์เซ็นต์ส่วนลดที่จะนำมาคำนวณกับราคาสินค้า</Typography>
            </>
          )}

          {selectedValue === "fixed" && (
            <>
              <CustomFormLabel htmlFor="p_fixed">
                ราคาหลังหักส่วนลดแบบคงที่{" "}
                <Typography color="error.main" component="span">
                  *
                </Typography>
              </CustomFormLabel>
              <BaseTextField name="p_fixed" formik={formik} placeholder="Discounted Price" fullWidth type="number" />
              <Typography variant="body2">กำหนดราคาสินค้าหลังหักส่วนลดแบบคงที่</Typography>
            </>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomFormLabel htmlFor="taxClass" sx={{ mt: 0 }}>
            ประเภทภาษี{" "}
            <Typography color="error.main" component="span">
              *
            </Typography>
          </CustomFormLabel>
          <CustomSelect id="taxClass" value={taxClass} onChange={handleTaxChange} fullWidth>
            <MenuItem value={"0"}>Select an option</MenuItem>
            <MenuItem value={"tax_free"}>Tax Free</MenuItem>
            <MenuItem value={"taxable"}>Taxable Goods</MenuItem>
            <MenuItem value={"downloadable"}>Downloadable Products</MenuItem>
          </CustomSelect>
          <Typography variant="body2">ตั้งประเภทภาษีของสินค้า</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomFormLabel htmlFor="p_vat" sx={{ mt: 0 }}>
            อัตรา VAT (%){" "}
            <Typography color="error.main" component="span">
              *
            </Typography>
          </CustomFormLabel>
          <BaseTextField name="p_vat" formik={formik} fullWidth type="number" />
          <Typography variant="body2">ตั้งค่าอัตรา VAT ของสินค้า</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PricingCard;
