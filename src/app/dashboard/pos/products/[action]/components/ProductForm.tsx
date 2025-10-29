"use client";
import { useFormik } from "formik";
import { Grid, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useProducts } from "@/common/contexts/ProductsContext";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";
import { UnitTypeEnum } from "@/common/contexts/ProductsContext/interfaces/products";
import React from "react";
import GeneralCard from "./GeneralCard";
import CategoryAndTags from "./CategoryAndTags";
import ProductTemplate from "./ProductTemplate";
import BlankCard from "@/components/shared/BlankCard";
import useIsMobile from "@/common/utils/state/isMobile";
import BaseButton from "@/common/components/base/BaseButton";
import ProductDetails, { unitTypeOptions } from "./ProductDetails";
import BaseFileInput from "@/common/components/base/BaseFileInput/BaseFileInput";
import type { CreateProductPayload, ApiDiscountType, ApiInventoryStatus } from "@/common/contexts/ProductsContext/interfaces/products";
import * as Yup from "yup";

const validationSchema = Yup.object({
  nameTh: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").required("กรุณากรอกชื่อสินค้า (ไทย)"),
  nameEn: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").nullable().notRequired(),

  descriptionTh: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").required("กรุณากรอกรายละเอียด (ไทย)"),
  descriptionEn: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").nullable().notRequired(),

  unitType: Yup.mixed<UnitTypeEnum>()
    .oneOf([UnitTypeEnum.PIECE, UnitTypeEnum.WEIGHT, UnitTypeEnum.VOLUME])
    .required("กรุณาเลือกประเภทหน่วยนับ"),
  unit: Yup.string().trim().min(1, "กรุณากรอกหน่วย").required("กรุณากรอกหน่วย"),

  categoryId: Yup.string().uuid("รูปแบบ UUID ไม่ถูกต้อง").nullable().notRequired(),
  branchId: Yup.string().uuid("รูปแบบ UUID ไม่ถูกต้อง").nullable().notRequired(),
  thumbnailImageId: Yup.string().uuid("รูปแบบ UUID ไม่ถูกต้อง").nullable().notRequired(),
  detailImageIds: Yup.array().of(Yup.string().uuid("รูปภาพต้องเป็น UUID")).nullable().notRequired(),

  isTaxInclusive: Yup.boolean().required("กรุณาระบุโหมดภาษี"),
  taxClassId: Yup.string().trim().required("กรุณาเลือกประเภทภาษี"),

  variant: Yup.object({
    nameTh: Yup.string().trim().min(1, "กรุณากรอกชื่อคุณลักษณะ (ไทย)").required("กรุณากรอกชื่อคุณลักษณะ (ไทย)"),
    nameEn: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").nullable().notRequired(),
  })
    .nullable()
    .notRequired(),

  productOptions: Yup.array()
    .of(
      Yup.object({
        upc: Yup.string().trim().notRequired(),
        sku: Yup.string().trim().notRequired(),
        price: Yup.number().typeError("กรุณากรอกราคาเป็นตัวเลข").required("กรุณากรอกราคา"),

        discountType: Yup.mixed<ApiDiscountType>()
          .oneOf(["none", "percentage", "fixed"])
          .required("กรุณาเลือกประเภทส่วนลด"),
        discountRate: Yup.number().typeError("กรุณากรอกส่วนลดเป็นตัวเลข").required("กรุณากรอกส่วนลด"),

        variantOption: Yup.object({
          nameTh: Yup.string().trim().min(1, "กรุณากรอกชื่อคุณลักษณะ (ไทย)").required("กรุณากรอกชื่อคุณลักษณะ (ไทย)"),
          nameEn: Yup.string().trim().min(2, "กรอกอย่างน้อย 2 อักขระ").nullable().notRequired(),
        })
          .nullable()
          .notRequired(),

        inventory: Yup.object({
          status: Yup.mixed<ApiInventoryStatus>().oneOf(["active", "inactive", "deleted"]).required("กรุณาเลือกสถานะสต็อก"),
          stock: Yup.number().typeError("กรุณากรอกจำนวนคงคลังเป็นตัวเลข").required("กรุณากรอกจำนวนคงคลัง"),
        }).required("กรุณากรอกข้อมูลสต็อก"),
      })
    )
    .min(1, "ต้องมีตัวเลือกสินค้าอย่างน้อย 1 รายการ")
    .required("กรุณาระบุตัวเลือกสินค้า"),
});

const ProductForm: React.FC = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data: session } = useSession();
  const { createProduct } = useProducts();
  const onClickCancel = () => {
    formik.resetForm();
    router.back();
  };
  const formik = useFormik<CreateProductPayload>({
    initialValues: {
      nameTh: "",
      nameEn: undefined,
      descriptionTh: '',
      descriptionEn: undefined,

      unitType: unitTypeOptions[0].value,
      unit: "ชิ้น",

      categoryId: undefined,
      branchId: undefined,
      thumbnailImageId: undefined,
      detailImageIds: [],

      isTaxInclusive: true,
      taxClassId: "none",

      variant: undefined,
      productOptions: [
        {
          upc: "",
          sku: "",
          price: 0,
          discountType: "none",
          discountRate: 0,
          variantOption: undefined,
          inventory: { status: "active", stock: 0 },
        },
      ],
    },
    validationSchema,
    onSubmit: async (values: CreateProductPayload) => {
      console.log('11111')
      const branchIdFromSession = (session?.user as any)?.branchId || undefined;

      const payload: CreateProductPayload = {
        nameTh: values.nameTh,
        nameEn: values.nameEn || undefined,
        descriptionTh: values.descriptionTh || undefined,
        descriptionEn: values.descriptionEn || undefined,
        unitType: values.unitType,
        unit: values.unit,

        categoryId: values.categoryId || undefined,
        branchId: values.branchId || branchIdFromSession,
        thumbnailImageId: values.thumbnailImageId || undefined,
        detailImageIds: values.detailImageIds?.length ? values.detailImageIds : undefined,

        isTaxInclusive: values.isTaxInclusive,
        taxClassId: values.taxClassId,

        variant: values.variant,
        productOptions: (values.productOptions || []).map((opt) => ({
          upc: opt.upc || undefined,
          sku: opt.sku || undefined,
          price: Number(opt.price ?? 0),
          discountType: opt.discountType,
          discountRate: Number(opt.discountRate ?? 0),
          variantOption: opt.variantOption,
          inventory: {
            status: opt.inventory.status,
            stock: Number(opt.inventory.stock ?? 0),
          },
        })),
      };
      console.log("🚀 ~ ProductForm ~ payload:", payload)

      await createProduct(payload);
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
              <ProductDetails formik={formik} />
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
                  formik.setFieldValue("thumbnailImageId", fileIds?.[0] ?? undefined);
                }}
                value={formik.values.thumbnailImageId ? [formik.values.thumbnailImageId] : []}
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
              <CategoryAndTags formik={formik} />
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
