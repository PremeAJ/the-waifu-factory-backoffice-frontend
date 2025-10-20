"use client";
import { FileSize } from "@/common/constants/file/fileSize";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import { Grid, Stack, Button } from "@mui/material";
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";
import { useFormik } from "formik";
import * as Yup from "yup";
import BlankCard from "@/components/shared/BlankCard";
import GeneralCard from "./GeneralCard";
import PricingCard from "./Pricing";
import ProductDetails from "./ProductDetails";
import ProductTemplate from "./ProductTemplate";
import React from "react";
import StatusCard from "./Status";
import VariationCard from "./VariationCard";
import BaseFileInput from "@/common/components/base/BaseFileInput/BaseFileInput";

const validationSchema = Yup.object({
  p_name_th: Yup.string().required("กรุณากรอกชื่อสินค้า (ไทย)"),
  p_name_en: Yup.string().nullable(),
  p_description_th: Yup.string().nullable(),
  p_description_en: Yup.string().nullable(),
  // เปลี่ยนจาก File[] เป็น string[] (fileIds)
  imageIds: Yup.array().of(Yup.string()).nullable(),
  detailImageIds: Yup.array().of(Yup.string()).nullable(),
});

const ProductForm: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      p_name_th: "",
      p_name_en: "",
      p_description_th: "",
      p_description_en: "",
      // เปลี่ยนจากเก็บ File objects เป็นเก็บ file IDs
      imageIds: [] as string[],
      detailImageIds: [] as string[],
      // add other fields as needed
    },
    validationSchema,
    onSubmit: (values) => {
      // ส่งค่าทั้งหน้า
      console.log("submit product form", values);
      // values จะมี imageIds และ detailImageIds เป็น string[] ที่พร้อมส่งให้ API
    },
  });

  // สำหรับการ debug
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
              <BaseFileInput
                label="อัปโหลดภาพสินค้า"
                placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
                multiple={false}
                accept={fileTypeGroup.image}
                // maxSize={FileSize.MB2}
                autoUpload={true} // อัปโหลดอัตโนมัติ
                toBucket={StorageBucket.PRODUCT_THUMBNAIL} // เลือก bucket ที่เหมาะสม
                // finalize={true} // finalize ทันทีหลังอัปโหลด
                onUploadComplete={(fileIds) => {
                  formik.setFieldValue("imageIds", fileIds);
                }}
                value={formik.values.imageIds} // ส่งค่าที่มีอยู่แล้ว (สำหรับกรณีแก้ไข)
              />
            </BlankCard>

            <BlankCard>
              <BaseFileInput
                label="อัปโหลดภาพรายละเอียดสินค้า (3ไฟล์)"
                placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
                multiple={true}
                accept={fileTypeGroup.image}
                // maxSize={FileSize.MB2}
                maxFiles={3}
                autoUpload={true} // อัปโหลดอัตโนมัติ
                toBucket={StorageBucket.PRODUCT_DETAIL} // เลือก bucket ที่เหมาะสม
                // finalize={true} // finalize ทันทีหลังอัปโหลด
                onUploadComplete={(fileIds) => {
                  formik.setFieldValue("detailImageIds", fileIds);
                }}
                value={formik.values.detailImageIds} // ส่งค่าที่มีอยู่แล้ว (สำหรับกรณีแก้ไข)
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
