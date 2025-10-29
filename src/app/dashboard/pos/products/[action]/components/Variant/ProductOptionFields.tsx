"use client";
import React from "react";
import { getIn } from "formik";
import { Grid } from "@mui/material";

import BaseChip from "@/common/components/base/BaseChip";
import BaseDropdown from "@/common/components/base/BaseDropdown";
import BaseRadio from "@/common/components/base/BaseRadio";
import BaseSlider from "@/common/components/base/BaseSlider";
import BaseTextField from "@/common/components/base/BaseTextField";

type Props = {
  formik: any;
  optionPath: string;
};

const ProductOptionFields: React.FC<Props> = ({ formik, optionPath }) => {
  const priceBase = Number(getIn(formik.values, `${optionPath}.price`) ?? 0);
  const discountType = getIn(formik.values, `${optionPath}.discountType`);
  const discountRate = Number(getIn(formik.values, `${optionPath}.discountRate`) ?? 0);
  const status = getIn(formik.values, `${optionPath}.inventory.status`);

  const finalPrice = React.useMemo(() => {
    let final = priceBase;
    if (discountType === "percentage") {
      final = priceBase * (1 - discountRate / 100);
    } else if (discountType === "fixed") {
      final = priceBase - discountRate;
    }
    return final < 0 ? 0 : Number(final.toFixed(2));
  }, [priceBase, discountType, discountRate]);

  return (
    <Grid container spacing={2} alignItems="center">
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
          options={[
            { value: "none", label: "ไม่มีส่วนลด" },
            { value: "percentage", label: "เปอร์เซ็นต์ %" },
            { value: "fixed", label: "ราคาคงที่" },
          ]}
        />
      </Grid>
      {discountType === "percentage" && (
        <Grid size={{ xs: 12 }}>
          <BaseSlider formik={formik} name={`${optionPath}.discountRate`} label="เปอร์เซ็นต์ส่วนลด" mode="percent" min={0} max={100} step={1} />
        </Grid>
      )}
      {discountType === "fixed" && (
        <Grid size={{ xs: 12 }}>
          <BaseTextField formik={formik} name={`${optionPath}.discountRate`} label="มูลค่าส่วนลด (คงที่)" type="number" inputProps={{ min: 0 }} fullWidth />
        </Grid>
      )}

      {/* Pricing */}
      <Grid size={{ xs: 6, md: 3 }}>
        <BaseTextField formik={formik} name={`${optionPath}.price`} label="ราคาพื้นฐาน" placeholder="0.00" type="number" fullWidth />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <BaseTextField name={`${optionPath}.price_final`} label="ราคาหลังคำนวน" value={finalPrice} type="number" disabled fullWidth />
      </Grid>

      {/* Inventory */}
      <Grid size={{ xs: 6, md: 3 }}>
        <BaseTextField formik={formik} name={`${optionPath}.inventory.stock`} label="จำนวนสต็อก" type="number" tooltip="จำนวนสินค้าที่มีอยู่ในคลัง"  fullWidth />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <BaseDropdown
          formik={formik}
          name={`${optionPath}.inventory.status`}
          label="สถานะ"
          value={status}
          options={[
            { value: "active", text: "ใช้งาน" },
            { value: "inactive", text: "ไม่ใช้งาน" },
          ]}
          renderOption={(option: any) => <BaseChip preset={option.value} />}
          renderValue={(selected: any) => <BaseChip preset={selected} />}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default ProductOptionFields;