"use client";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import { Grid, Stack } from "@mui/material";
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";
import { useFormik } from "formik";
import { useProducts } from "@/common/contexts/ProductsContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { validationSchema } from "../validation/yup";
import BaseButton from "@/common/components/base/BaseButton";
import BaseFileInput from "@/common/components/base/BaseFileInput/BaseFileInput";
import BlankCard from "@/components/shared/BlankCard";
import CategoryAndTags from "./CategoryAndTags";
import GeneralCard from "./GeneralCard";
import ProductDetails, { unitTypeOptions } from "./ProductDetails";
import ProductTemplate from "./ProductTemplate";
import React from "react";
import type { CreateProductPayload } from "@/common/contexts/ProductsContext/interfaces/products";
import useIsMobile from "@/common/utils/state/isMobile";

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
    validateOnMount: true,
    onSubmit: async (values: CreateProductPayload) => {
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
    <form noValidate onSubmit={formik.handleSubmit}>
      {/* debug */}
      {JSON.stringify(formik.errors)}
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
              {JSON.stringify(formik.values, null, 2)}
            <Stack direction="row" spacing={2} justifyContent="space-between" p={2}>
              <BaseButton preset="cancel" label="ยกเลิก" variant="outlined" color="error" fullWidth={isMobile} onClick={onClickCancel} />
              <BaseButton
                preset="save"
                label="บันทึก"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                disabled={!formik.isValid || formik.isSubmitting}
              />
            </Stack>
          </BlankCard>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
