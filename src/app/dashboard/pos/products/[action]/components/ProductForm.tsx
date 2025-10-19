"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, Stack, Button } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import BaseFileInput from "@/common/components/base/BaseFileInput";
import { FileSize } from "@/common/constants/file/fileSize";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import GeneralCard from "./GeneralCard";
import VariationCard from "./VariationCard";
import PricingCard from "./Pricing";
import ProductTemplate from "./ProductTemplate";
import ProductDetails from "./ProductDetails";
import StatusCard from "./Status";

/**
 * Parent form that uses formik and passes formik down to step components (GeneralCard, etc.)
 * Add other cards (VariationCard, PricingCard...) as children and pass formik where needed.
 */

const validationSchema = Yup.object({
  p_name_th: Yup.string().required("กรุณากรอกชื่อสินค้า (ไทย)"),
  p_name_en: Yup.string().nullable(),
  p_description_th: Yup.string().nullable(),
  p_description_en: Yup.string().nullable(),
  images: Yup.array().of(Yup.mixed()).nullable(),
  detailImages: Yup.array().of(Yup.mixed()).nullable(),
});

const ProductForm: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      p_name_th: "",
      p_name_en: "",
      p_description_th: "",
      p_description_en: "",
      images: [] as File[],
      detailImages: [] as File[],
      // add other fields as needed
    },
    validationSchema,
    onSubmit: (values) => {
      // ส่งค่าทั้งหน้า
      console.log("submit product form", values);
    },
  });

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
              <BaseFileInput
                label="อัปโหลดภาพสินค้า"
                placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
                multiple={false}
                accept={fileTypeGroup.image}
                maxSize={FileSize.MB2}
                onChange={(files) => {
                  formik.setFieldValue("images", files || []);
                }}
              />
            </BlankCard>

            <BlankCard>
              <BaseFileInput
                label="อัปโหลดภาพรายละเอียดสินค้า (3ไฟล์)"
                placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
                multiple={true}
                accept={fileTypeGroup.image}
                maxSize={FileSize.MB2}
                maxFiles={3}
                onChange={(files) => {
                  formik.setFieldValue("detailImages", files || []);
                }}
              />
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
              <StatusCard formik={formik} />
            </BlankCard>

            <BlankCard>
              <ProductDetails formik={formik} />
            </BlankCard>

            <BlankCard>
              <ProductTemplate formik={formik} />
            </BlankCard>
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} mt={3}>
        <Button type="submit" variant="contained" color="primary">
          บันทึก
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            formik.resetForm();
          }}
        >
          ยกเลิก
        </Button>
      </Stack>
    </form>
  );
};

export default ProductForm;
