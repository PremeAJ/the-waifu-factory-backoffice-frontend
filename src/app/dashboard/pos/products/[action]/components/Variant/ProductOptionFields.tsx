"use client";

import { FC, useEffect, useState, useMemo } from "react";
import { getIn } from "formik";
import { Box, Grid, Typography } from "@mui/material";
import { BaseChip, BaseDropdown, BaseFileInput, BaseLabel, BaseNumberField, BaseRadio, BaseSlider, BaseTextField } from "@/common/components/base";
import { discountTypeOptions, inventoryStatusOptions } from "@/common/contexts/ProductsContext/constants/constants";
import { UnitTypeEnum } from "@/common/contexts/ProductsContext/interfaces/products";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";

type Props = {
  formik: any;
  optionPath: string;
};

const ProductOptionFields: FC<Props> = ({ formik, optionPath }) => {
  const [lastEdited, setLastEdited] = useState<"base" | "final">("base");

  const priceBase = Number(getIn(formik.values, `${optionPath}.basePrice`) ?? 0);
  const priceFinal = Number(getIn(formik.values, `${optionPath}.finalPrice`) ?? 0);
  const discountType = getIn(formik.values, `${optionPath}.discountType`);
  const discountRate = Number(getIn(formik.values, `${optionPath}.discountRate`) ?? 0);
  const status = getIn(formik.values, `${optionPath}.inventory.status`);

  // ✅ ดึงทั้ง id, url, originName
  const thumbnailImageId = getIn(formik.values, `${optionPath}.thumbnailImageId`);
  const thumbnailImageUrl = getIn(formik.values, `${optionPath}.thumbnailImageUrl`);
  const thumbnailOriginName = getIn(formik.values, `${optionPath}.thumbnailOriginName`);

  const taxRate = Number(formik.values?.taxRate ?? 0);
  const isTaxInclusive = formik.values?.isTaxInclusive ?? true;
  const unitType = formik.values?.unitType;
  const unit = formik.values?.unit || "";
  const isSoldByPiece = unitType === UnitTypeEnum.PIECE;

  // ✅ สร้าง thumbnailValue - ต้องเปลี่ยนเมื่อ formik values เปลี่ยน
  const thumbnailValue = useMemo(() => {
    if (!thumbnailImageId) return [];

    return [
      {
        id: thumbnailImageId,
        url: thumbnailImageUrl,
        originName: thumbnailOriginName,
      },
    ];
  }, [thumbnailImageId, thumbnailImageUrl, thumbnailOriginName]);

  // Debug log
  useEffect(() => {
    console.log("ProductOptionFields thumbnailValue:", thumbnailValue);
  }, [thumbnailValue]);

  useEffect(() => {
    if (lastEdited !== "base") return;

    let priceAfterDiscount = priceBase;
    if (discountType === "percentage") {
      priceAfterDiscount = priceBase * (1 - discountRate / 100);
    } else if (discountType === "fixed") {
      priceAfterDiscount = priceBase - discountRate;
    }

    let finalPriceWithTax = priceAfterDiscount;
    if (!isTaxInclusive) {
      finalPriceWithTax = priceAfterDiscount * (1 + taxRate / 100);
    }

    const newFinalPrice = finalPriceWithTax < 0 ? 0 : Number(finalPriceWithTax.toFixed(2));

    if (newFinalPrice !== priceFinal) {
      formik.setFieldValue(`${optionPath}.finalPrice`, newFinalPrice);
    }
  }, [priceBase, discountType, discountRate, taxRate, isTaxInclusive, lastEdited, formik, optionPath, priceFinal]);

  useEffect(() => {
    if (lastEdited !== "final") return;

    let priceBeforeTax = priceFinal;
    if (!isTaxInclusive) {
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
  }, [priceFinal, discountType, discountRate, taxRate, isTaxInclusive, lastEdited, formik, optionPath, priceBase]);

  const renderPricingFields = () => {
    if (isSoldByPiece) {
      return (
        <>
          <Grid size={{ xs: 6, md: 3 }}>
            <BaseNumberField
              formik={formik}
              name={`${optionPath}.basePrice`}
              label="ราคาพื้นฐาน"
              fullWidth
              suffix="฿"
              onFocus={() => setLastEdited("base")}
              maximumFractionDigits={2}
              minimumFractionDigits={0}
              allowDecimal={true}
              allowNegative={false}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <BaseNumberField
              formik={formik}
              name={`${optionPath}.finalPrice`}
              label="ราคาหลังคำนวน"
              fullWidth
              suffix="฿"
              onFocus={() => setLastEdited("final")}
              maximumFractionDigits={2}
              minimumFractionDigits={0}
              allowDecimal={true}
              allowNegative={false}
            />
          </Grid>
        </>
      );
    }

    return (
      <>
        <Grid size={{ xs: 12, md: 6 }}>
          <BaseLabel>ราคาพื้นฐาน</BaseLabel>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BaseNumberField
              formik={formik}
              name={`${optionPath}.basePrice`}
              suffix="฿"
              onFocus={() => setLastEdited("base")}
              maximumFractionDigits={2}
              allowDecimal={true}
            />
            <Typography variant="body1"> ต่อ </Typography>
            <BaseNumberField formik={formik} name={`${optionPath}.pricePerUnit`} suffix={unit} maximumFractionDigits={3} allowDecimal={true} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BaseLabel>ราคาหลังคำนวณ</BaseLabel>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BaseNumberField
              formik={formik}
              name={`${optionPath}.finalPrice`}
              suffix="฿"
              onFocus={() => setLastEdited("final")}
              maximumFractionDigits={2}
              allowDecimal={true}
            />
            <Typography variant="body1"> ต่อ </Typography>
            <BaseNumberField
              formik={formik}
              name={`${optionPath}.pricePerUnit`}
              suffix={unit}
              disabled
              maximumFractionDigits={3}
              allowDecimal={true}
            />
          </Box>
        </Grid>
      </>
    );
  };

  return (
    <Grid container spacing={2} alignItems="flex-end">
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseTextField formik={formik} name={`${optionPath}.upc`} label="UPC" placeholder="UPC" tooltip="รหัสบาร์โค้ด (UPC/EAN)" fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BaseTextField formik={formik} name={`${optionPath}.sku`} label="SKU" placeholder="SKU" tooltip="รหัสสินค้าที่ใช้ภายในระบบ (SKU)" fullWidth />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <BaseRadio
          formik={formik}
          name={`${optionPath}.discountType`}
          label="ประเภทส่วนลด"
          variant="card"
          defaultValue="none"
          options={discountTypeOptions}
          onClick={() => setLastEdited("base")}
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
            onMouseUp={() => setLastEdited("base")}
          />
        </Grid>
      )}
      {discountType === "fixed" && (
        <Grid size={{ xs: 12 }}>
          <BaseNumberField
            formik={formik}
            name={`${optionPath}.discountRate`}
            label="มูลค่าส่วนลด (คงที่)"
            fullWidth
            suffix="฿"
            onFocus={() => setLastEdited("base")}
            maximumFractionDigits={2}
            allowDecimal={true}
            allowNegative={false}
          />
        </Grid>
      )}
      <Grid size={{ xs: 12 }} container>
        {renderPricingFields()}

        <Grid size={{ xs: 6, md: 3 }} alignSelf={"flex-end"}>
          <BaseNumberField
            formik={formik}
            name={`${optionPath}.inventory.stock`}
            label="จำนวนสต็อก"
            tooltip="จำนวนสินค้าที่มีอยู่ในคลัง"
            fullWidth
            suffix={unit}
            allowDecimal={false}
            allowNegative={false}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }} alignSelf={"flex-end"}>
          <BaseNumberField
            formik={formik}
            name={`${optionPath}.lowStockThreshold`}
            label="สินค้าเหลือน้อย"
            tooltip="เมื่อจำนวนสินค้าถึงจุดนี้ ระบบจะแจ้งเตือนให้ทราบ"
            placeholder="3"
            fullWidth
            suffix={unit}
            allowDecimal={false}
            allowNegative={false}
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }} justifyContent={"flex-end"}>
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

      <Grid size={{ xs: 12 }}>
        <BaseFileInput
          required
          label="อัปโหลดภาพสินค้า"
          placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
          multiple={false}
          accept={fileTypeGroup.image}
          autoUpload={true}
          toBucket={StorageBucket.PRODUCT_THUMBNAIL}
          onUploadComplete={(files) => {
            console.log("onUploadComplete files:", files); // ✅ Debug log
            const file = files[0];
            if (file) {
              // ✅ บันทึกทั้ง id, url, originName
              formik.setFieldValue(`${optionPath}.thumbnailImageId`, file.id);
              formik.setFieldValue(`${optionPath}.thumbnailImageUrl`, file.url);
              formik.setFieldValue(`${optionPath}.thumbnailOriginName`, file.originName);

              console.log("Set formik values:", {
                id: file.id,
                url: file.url,
                originName: file.originName,
              });
            } else {
              formik.setFieldValue(`${optionPath}.thumbnailImageId`, undefined);
              formik.setFieldValue(`${optionPath}.thumbnailImageUrl`, undefined);
              formik.setFieldValue(`${optionPath}.thumbnailOriginName`, undefined);
            }
          }}
          value={thumbnailValue}
        />
      </Grid>
    </Grid>
  );
};

export default ProductOptionFields;
