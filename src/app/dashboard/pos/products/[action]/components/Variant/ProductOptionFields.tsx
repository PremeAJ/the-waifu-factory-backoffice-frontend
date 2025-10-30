"use client";
import React, { useState, useEffect } from "react";
import { getIn } from "formik";
import { Grid, Box, Typography } from "@mui/material";

import BaseChip from "@/common/components/base/BaseChip";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseRadio from "@/common/components/base/BaseRadio";
import BaseSlider from "@/common/components/base/BaseSlider";
import BaseTextField from "@/common/components/base/BaseTextField";
import { UnitTypeEnum } from "@/common/contexts/ProductsContext/interfaces/products";
import BaseLabel from "@/common/components/base/BaseLabel";
import { discountTypeOptions, inventoryStatusOptions } from "@/common/contexts/ProductsContext/constants/constants";

type Props = {
  formik: any;
  optionPath: string;
};

const ProductOptionFields: React.FC<Props> = ({ formik, optionPath }) => {
  // State to track which field was last edited by the user
  const [lastEdited, setLastEdited] = useState<"base" | "final">("base");

  // Get values from Formik
  const priceBase = Number(getIn(formik.values, `${optionPath}.basePrice`) ?? 0);
  const priceFinal = Number(getIn(formik.values, `${optionPath}.finalPrice`) ?? 0);
  const discountType = getIn(formik.values, `${optionPath}.discountType`);
  const discountRate = Number(getIn(formik.values, `${optionPath}.discountRate`) ?? 0);
  const status = getIn(formik.values, `${optionPath}.inventory.status`);

  // Get tax values from the root of the form
  const taxRate = Number(formik.values?.taxRate ?? 0);
  const isTaxInclusive = formik.values?.isTaxInclusive ?? true;

  const unitType = formik.values?.unitType;
  const unit = formik.values?.unit || "";

  const isSoldByPiece = unitType === UnitTypeEnum.PIECE;

  // Forward calculation: from base price to final price
  useEffect(() => {
    if (lastEdited !== "base") return;

    let priceAfterDiscount = priceBase;
    if (discountType === "percentage") {
      priceAfterDiscount = priceBase * (1 - discountRate / 100);
    } else if (discountType === "fixed") {
      priceAfterDiscount = priceBase - discountRate;
    }

    let finalPriceWithTax = priceAfterDiscount;
    if (isTaxInclusive) {
      // If price is tax-inclusive, the base price already contains the tax component.
      // The final price is just the base price after discount.
      finalPriceWithTax = priceAfterDiscount;
    } else {
      // If price is tax-exclusive, add tax on top of the discounted price.
      finalPriceWithTax = priceAfterDiscount * (1 + taxRate / 100);
    }

    const newFinalPrice = finalPriceWithTax < 0 ? 0 : Number(finalPriceWithTax.toFixed(2));

    if (newFinalPrice !== priceFinal) {
      formik.setFieldValue(`${optionPath}.finalPrice`, newFinalPrice);
    }
  }, [priceBase, discountType, discountRate, taxRate, isTaxInclusive, lastEdited]);

  // Reverse calculation: from final price to base price
  useEffect(() => {
    if (lastEdited !== "final") return;

    let priceBeforeTax = priceFinal;
    if (!isTaxInclusive) {
      // If the final price was calculated with tax on top, we need to remove it first.
      priceBeforeTax = priceFinal / (1 + taxRate / 100);
    }

    let newBasePrice = priceBeforeTax;
    if (discountType === "percentage") {
      if (discountRate < 100) {
        newBasePrice = priceBeforeTax / (1 - discountRate / 100);
      }
    } else if (discountType === "fixed") {
      newBasePrice = priceBeforeTax + discountRate;
    }

    newBasePrice = newBasePrice < 0 ? 0 : Number(newBasePrice.toFixed(2));

    if (newBasePrice !== priceBase) {
      formik.setFieldValue(`${optionPath}.basePrice`, newBasePrice);
    }
  }, [priceFinal, discountType, discountRate, taxRate, isTaxInclusive, lastEdited]);

  const renderPricingFields = () => {
    if (isSoldByPiece) {
      return (
        <>
          <Grid size={{ xs: 6, md: 3 }}>
            <BaseTextField
              formik={formik}
              name={`${optionPath}.basePrice`}
              label="ราคาพื้นฐาน"
              type="number"
              fullWidth
              suffix="฿"
              onFocus={() => setLastEdited("base")}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <BaseTextField
              formik={formik}
              name={`${optionPath}.finalPrice`}
              label="ราคาหลังคำนวน"
              type="number"
              fullWidth
              suffix="฿"
              onFocus={() => setLastEdited("final")}
            />
          </Grid>
        </>
      );
    }

    // UI for Weight/Volume
    return (
      <>
        <Grid size={{ xs: 12, md: 6 }}>
          <BaseLabel>ราคาพื้นฐาน</BaseLabel>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BaseTextField formik={formik} name={`${optionPath}.basePrice`} type="number" onFocus={() => setLastEdited("base")} suffix="฿" />
            <Typography variant="body1"> ต่อ </Typography>
            <BaseTextField formik={formik} name={`${optionPath}.pricePerUnit`} type="number" suffix={unit} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BaseLabel>ราคาหลังคำนวณ</BaseLabel>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BaseTextField formik={formik} name={`${optionPath}.finalPrice`} type="number" onFocus={() => setLastEdited("final")} suffix="฿" />
            <Typography variant="body1"> ต่อ </Typography>
            <BaseTextField formik={formik} name={`${optionPath}.pricePerUnit`} type="number" disabled suffix={unit} />
          </Box>
        </Grid>
      </>
    );
  };

  return (
    <Grid container spacing={2} alignItems="flex-end">
      {/* Identifiers */}
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseTextField formik={formik} name={`${optionPath}.upc`} label="UPC" placeholder="UPC" tooltip="รหัสบาร์โค้ด (UPC/EAN)" fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseTextField formik={formik} name={`${optionPath}.sku`} label="SKU" placeholder="SKU" tooltip="รหัสสินค้าที่ใช้ภายในระบบ (SKU)" fullWidth />
      </Grid>

      {/* Discount Section */}
      <Grid size={{ xs: 12 }}>
        <BaseRadio
          formik={formik}
          name={`${optionPath}.discountType`}
          label="ประเภทส่วนลด"
          variant="card"
          defaultValue="none"
          options={discountTypeOptions}
          onClick={() => setLastEdited("base")} // Recalculate when discount type changes
        />
      </Grid>
      {discountType === "percentage" && (
        <Grid size={{ xs: 12 }}>
          <BaseSlider
            formik={formik}
            name={`${optionPath}.discountRate`}
            label="เปอร์เซ็นต์ส่วนลด"
            min={0}
            max={100}
            step={1}
            suffix="%"
            onMouseUp={() => setLastEdited("base")} // Recalculate after slider is released
          />
        </Grid>
      )}
      {discountType === "fixed" && (
        <Grid size={{ xs: 12 }}>
          <BaseTextField
            formik={formik}
            name={`${optionPath}.discountRate`}
            label="มูลค่าส่วนลด (คงที่)"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            suffix="฿"
            onFocus={() => setLastEdited("base")}
          />
        </Grid>
      )}

      {/* Pricing */}
      {renderPricingFields()}

      {/* Inventory */}
      <Grid size={{ xs: 6, md: 3 }} alignSelf={"flex-end"}>
        <BaseTextField
          formik={formik}
          name={`${optionPath}.inventory.stock`}
          label="จำนวนสต็อก"
          type="number"
          tooltip="จำนวนสินค้าที่มีอยู่ในคลัง"
          fullWidth
          suffix={unit}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }} justifyContent={"flex-end"}>
        <BaseDropdown
          formik={formik}
          name={`${optionPath}.inventory.status`}
          label="สถานะ"
          value={status}
          options={inventoryStatusOptions}
          renderOption={(option: any) => <BaseChip preset={option.value} />}
          renderValue={(selected: any) => <BaseChip preset={selected} />}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default ProductOptionFields;
