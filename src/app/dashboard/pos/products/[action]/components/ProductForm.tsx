"use client";
import { BaseButton, BaseFileInput } from "@/common/components/base";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import { Grid, Stack } from "@mui/material";
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";
import { unitTypeOptions } from "@/common/contexts/ProductsContext/constants/constants";
import { useFormik } from "formik";
import { useProducts } from "@/common/contexts";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { validationSchema } from "../validation/yup";
import BaseDebug from "@/common/components/debug/BaseDebug";
import BlankCard from "@/components/shared/BlankCard";
import CategoryAndTags from "./CategoryAndTags";
import GeneralCard from "./GeneralCard";
import ProductDetails from "./ProductDetails";
import ProductTemplate from "./ProductTemplate";
import React, { useMemo } from "react";
import type { CreateProductPayload, CreateProductOptionPayload, ProductType } from "@/common/contexts/ProductsContext/interfaces/products";
import useIsMobile from "@/common/utils/state/isMobile";

interface ProductFormProps {
  initialData?: ProductType | null;
}

const mapProductToFormValues = (p?: ProductType | null): CreateProductPayload => {
  if (!p) {
    return {
      nameTh: "",
      nameEn: undefined,
      descriptionTh: "",
      descriptionEn: undefined,
      unitType: unitTypeOptions[0].value,
      unit: "ชิ้น",
      categoryId: undefined,
      branchId: undefined,
      thumbnailImageId: undefined,
      detailImageIds: [],
      tags: [],
      isTaxInclusive: true,
      taxClassId: "none",
      taxRate: 0,
      variant: undefined,
      productOptions: [
        {
          upc: "",
          sku: "",
          basePrice: 0,
          finalPrice: 0,
          pricePerUnit: 1,
          discountType: "none",
          discountRate: 0,
          variantOption: undefined,
          inventory: { status: "active", stock: 0 },
        },
      ],
    };
  }

  const thumbnail = p.productFiles?.find((f) => f.uploadedFile?.bucket?.includes("thumbnail"));
  const details = (p.productFiles || []).filter((f) => f.uploadedFile?.bucket?.includes("detail"));

  const productOptions = (p.productOptions || []).map((opt) => ({
    upc: opt.upc ?? "",
    sku: opt.sku ?? "",
    basePrice: Number(opt.basePrice ?? 0),
    finalPrice: Number(opt.finalPrice ?? 0),
    pricePerUnit: Number(opt.pricePerUnit ?? 1),
    discountType: opt.discountType ?? "none",
    discountRate: Number(opt.discountRate ?? 0),
    variantOption: opt.variantOption ?? undefined,
    inventory: opt.inventory ?? { status: "active", stock: 0 },
  })) as CreateProductOptionPayload[];

  return {
    nameTh: p.nameTh ?? "",
    nameEn: p.nameEn ?? undefined,
    descriptionTh: p.descriptionTh ?? "",
    descriptionEn: p.descriptionEn ?? undefined,
    unitType: (p.unitType as any) ?? unitTypeOptions[0].value,
    unit: p.unit ?? "ชิ้น",
    categoryId: p.categories?.id ?? undefined,
    branchId: undefined,
    thumbnailImageId: thumbnail?.uploadedFile?.id ?? undefined,
    detailImageIds: details.map((d) => d.uploadedFile?.id).filter(Boolean) as string[],
    tags: p.tags ?? [],
    isTaxInclusive: p.isTaxInclusive ?? true,
    taxClassId: p.taxClassId ?? "none",
    taxRate: Number(p.taxClass?.rate ?? 0),
    variant: p.variant ?? undefined,
    productOptions: productOptions.length
      ? productOptions
      : [
          {
            upc: "",
            sku: "",
            basePrice: 0,
            finalPrice: 0,
            pricePerUnit: 1,
            discountType: "none",
            discountRate: 0,
            variantOption: undefined,
            inventory: { status: "active", stock: 0 },
          },
        ],
  };
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData = null }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { data: session } = useSession();
  const { createProduct, updateProduct } = useProducts();

  const initialValues = useMemo(() => mapProductToFormValues(initialData), [initialData]);

  const onClickCancel = () => {
    formik.resetForm();
    router.back();
  };

  const formik = useFormik<CreateProductPayload>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values: CreateProductPayload) => {
      const branchIdFromSession = (session?.user as any)?.branchId || undefined;
      const isEdit = Boolean(initialData?.id);
      const productId = initialData?.id as string | undefined;

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
        tags: values.tags?.length ? values.tags : undefined,
        isTaxInclusive: values.isTaxInclusive,
        taxClassId: values.taxClassId,
        taxRate: Number(values.taxRate ?? 0),
        variant: values.variant,
        productOptions: (values.productOptions || []).map((opt, idx) => ({
          id: initialData?.productOptions?.[idx]?.id,
          upc: opt.upc || undefined,
          sku: opt.sku || undefined,
          basePrice: Number(opt.basePrice ?? 0),
          finalPrice: Number(opt.finalPrice ?? 0),
          pricePerUnit: Number(opt.pricePerUnit ?? 1),
          discountType: opt.discountType,
          discountRate: Number(opt.discountRate ?? 0),
          variantOption: opt.variantOption,
          inventory: {
            status: opt.inventory.status,
            stock: Number(opt.inventory.stock ?? 0),
          },
        })) as CreateProductOptionPayload[],
      };

      if (isEdit && productId) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }
      router.replace("/dashboard/pos/products");
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <BaseDebug data={{ values: formik.values, errors: formik.errors }} />
      <Grid container spacing={3}>
        <Grid size={{ lg: 8 }}>
          <Stack spacing={3}>
            <BlankCard>
              <GeneralCard formik={formik} />
            </BlankCard>
            <BlankCard>
              <ProductDetails formik={formik} />
            </BlankCard>
          </Stack>
        </Grid>
        <Grid size={{ lg: 4 }}>
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
              <BaseButton
                preset="cancel"
                label="ยกเลิก"
                variant="outlined"
                color="error"
                fullWidth={isMobile}
                onClick={onClickCancel}
                loading={formik.isSubmitting}
              />
              <BaseButton
                preset="save"
                label={initialData?.id ? "อัปเดต" : "บันทึก"}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                loading={formik.isSubmitting}
              />
            </Stack>
          </BlankCard>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
