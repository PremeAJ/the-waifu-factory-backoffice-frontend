"use client";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import { Grid, Stack } from "@mui/material";
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ProductFormValues, UnitTypeEnum } from "@/common/contexts/ProductsContext/interfaces/products";
import BaseButton from "@/common/components/base/BaseButton";
import BaseFileInput from "@/common/components/base/BaseFileInput/BaseFileInput";
import BlankCard from "@/components/shared/BlankCard";
import GeneralCard from "./GeneralCard";
import PricingCard from "./Pricing";
import ProductDetails from "./ProductDetails";
import ProductTemplate from "./ProductTemplate";
import React from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import VariationCard, { unitTypeOptions } from "./VariationCard";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  p_name_th: Yup.string().required("กรุณากรอกชื่อสินค้า (ไทย)"),
  p_name_en: Yup.string().nullable(),
  p_description_th: Yup.string().nullable(),
  p_description_en: Yup.string().nullable(),
  // เปลี่ยนจาก File[] เป็น string[] (fileIds)
  imageIds: Yup.array().of(Yup.string()).nullable(),
  detailImageIds: Yup.array().of(Yup.string()).nullable(),
  unitType: Yup.mixed<UnitTypeEnum>().oneOf([UnitTypeEnum.PIECE, UnitTypeEnum.WEIGHT, UnitTypeEnum.VOLUME]).required("กรุณาเลือกประเภทหน่วยนับ"),
  unit: Yup.string().trim().required("กรุณากรอกหน่วย"),
  categories: Yup.array().of(Yup.string()).nullable(),
  tags: Yup.array().of(Yup.string()).nullable(),
});

const ProductForm: React.FC = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const onClickCancel = () => {
    formik.resetForm();
    router.back();
  };
  const formik = useFormik<ProductFormValues>({
    initialValues: {
      p_name_th: "",
      p_name_en: null,
      p_description_th: null,
      p_description_en: null,
      imageIds: [],
      detailImageIds: [],
      unitType: unitTypeOptions[0].value,
      unit: "ชิ้น",
      variant: undefined,
      productOptions: [
        {
          upc: "",
          sku: "",
          price: 0,
          inventory: { status: "active", stock: 0 },
        },
      ],
      status: "active",
      discountType: "no_discount",
      discountValue: 0,
      categories: [],
      tags: [],
    },
    validationSchema,
    onSubmit: (values: ProductFormValues) => {
      console.log("submit product form", values);
    },
  });

  console.log("Current image IDs:", formik.values.imageIds);
  console.log("Current detail image IDs:", formik.values.detailImageIds);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid
          size={{
            lg: 8,
          }}
        >
          <Stack spacing={3}>
            <BlankCard>
              <GeneralCard formik={formik} />
            </BlankCard>
            <BlankCard>
              <VariationCard formik={formik} />
            </BlankCard>
            <BlankCard>
              <PricingCard formik={formik} />
            </BlankCard>
          </Stack>
        </Grid>
        <Grid
          size={{
            lg: 4,
          }}
        >
          <Stack spacing={3}>
            <BlankCard>
              <BaseFileInput
                label="อัปโหลดภาพสินค้า"
                placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
                multiple={false}
                accept={fileTypeGroup.image}
                autoUpload={true}
                toBucket={StorageBucket.PRODUCT_THUMBNAIL}
                onUploadComplete={(fileIds) => {
                  formik.setFieldValue("imageIds", fileIds);
                }}
                value={formik.values.imageIds}
              />
            </BlankCard>

            <BlankCard>
              <BaseFileInput
                label="อัปโหลดภาพรายละเอียดสินค้า (3ไฟล์)"
                placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
                multiple={true}
                accept={fileTypeGroup.image}
                maxFiles={3}
                autoUpload={true}
                toBucket={StorageBucket.PRODUCT_DETAIL}
                onUploadComplete={(fileIds) => {
                  formik.setFieldValue("detailImageIds", fileIds);
                }}
                value={formik.values.detailImageIds}
              />
            </BlankCard>

            <BlankCard>
              <ProductDetails formik={formik} />
            </BlankCard>

            <BlankCard>
              <ProductTemplate formik={formik} />
            </BlankCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <BlankCard>
            <Stack direction="row" spacing={2} justifyContent="space-between" p={2}>
              <BaseButton preset="cancel" label="ยกเลิก" variant="outlined" color="error" fullWidth={isMobile} onClick={onClickCancel} />
              <BaseButton preset="save" label="บันทึก" type="submit" variant="contained" color="primary" fullWidth={isMobile} />
            </Stack>
          </BlankCard>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
