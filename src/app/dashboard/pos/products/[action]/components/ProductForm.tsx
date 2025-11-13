"use client";
import { BaseButton, BaseFileInput, BaseFloatingButton } from "@/common/components/base";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import { Grid, Stack } from "@mui/material";
import { StorageBucket } from "@/common/contexts/UploadContext/interfaces/upload";
import { unitTypeOptions } from "@/common/contexts/ProductsContext/constants/constants";
import { useFormik } from "formik";
import { useProducts, useUpload } from "@/common/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { validationSchema } from "../validation/yup";
import BaseDebug from "@/common/components/debug/BaseDebug";
import BlankCard from "@/components/shared/BlankCard";
import CategoryAndTags from "./CategoryAndTags";
import GeneralCard from "./GeneralCard";
import PageLoader from "@/common/components/loaders/PageLoader";
import ProductDetails from "./ProductDetails";
import ProductTemplate from "./ProductTemplate";
import React, { useMemo, useEffect, useState } from "react";
import type { CreateProductPayload, CreateProductOptionPayload, ProductType } from "@/common/contexts/ProductsContext/interfaces/products";
import useIsMobile from "@/common/utils/state/isMobile";

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
          thumbnailImageId: undefined,
          thumbnailImageUrl: undefined,
          thumbnailOriginName: undefined,
          variantOption: undefined,
          inventory: { status: "active", stock: 0 },
        },
      ],
    };
  }

  // ✅ แก้ไข: แปลง productFiles เป็น array of objects
  const details = (p.productFiles || [])
    .filter((f) => f.uploadedFile?.bucket?.includes("detail"))
    .map((f) => ({
      id: f.uploadedFile?.id!,
      url: f.uploadedFile?.url,
      originName: f.uploadedFile?.originName,
    }))
    .filter((f) => f.id); // กรองเฉพาะที่มี id

  const productOptions = (p.productOptions || []).map((opt) => ({
    upc: opt.upc ?? "",
    sku: opt.sku ?? "",
    basePrice: Number(opt.basePrice ?? 0),
    finalPrice: Number(opt.finalPrice ?? 0),
    pricePerUnit: Number(opt.pricePerUnit ?? 1),
    discountType: opt.discountType ?? "none",
    discountRate: Number(opt.discountRate ?? 0),
    thumbnailImageId: opt.productFiles?.id ?? undefined,
    thumbnailImageUrl: opt.productFiles?.url ?? undefined,
    thumbnailOriginName: opt.productFiles?.originName ?? undefined,
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
    detailImageIds: details as any, // ✅ ใช้ array of objects
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
            thumbnailImageId: undefined,
            thumbnailImageUrl: undefined,
            thumbnailOriginName: undefined,
            variantOption: undefined,
            inventory: { status: "active", stock: 0 },
          },
        ],
  };
};

const ProductForm: React.FC = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isUploading } = useUpload();
  const id = searchParams?.get("id") ?? undefined; // มี id = โหมดแก้ไข
  const { data: session } = useSession();
  const { createProduct, updateProduct, getProductById } = useProducts();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));

  useEffect(() => {
    (async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const product = await getProductById(id);
      if (product) {
        setProduct(product || null);
        setLoading(false);
      }
    })();
  }, []);

  const initialValues = useMemo(() => mapProductToFormValues(product), [product]);

  const formik = useFormik<CreateProductPayload>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values: CreateProductPayload) => {
      const branchIdFromSession = (session?.user as any)?.branchId || undefined;
      const isEdit = Boolean(id);
      const productId = id;

      // ✅ แปลง detailImageIds เป็น string[]
      const detailImageIds = (values.detailImageIds || [])
        .map((item: any) => {
          if (typeof item === "string") return item;
          return item.id;
        })
        .filter(Boolean) as string[];

      // ✅ แปลง productOptions - ลบ url และ originName
      const productOptions = (values.productOptions || []).map((opt, idx) => {
        const { thumbnailImageUrl, thumbnailOriginName, ...rest } = opt;
        return {
          id: product?.productOptions?.[idx]?.id,
          upc: rest.upc || undefined,
          sku: rest.sku || undefined,
          basePrice: Number(rest.basePrice ?? 0),
          finalPrice: Number(rest.finalPrice ?? 0),
          pricePerUnit: Number(rest.pricePerUnit ?? 1),
          discountType: rest.discountType,
          discountRate: Number(rest.discountRate ?? 0),
          thumbnailImageId: rest.thumbnailImageId || undefined,
          variantOption: rest.variantOption,
          inventory: {
            status: rest.inventory.status,
            stock: Number(rest.inventory.stock ?? 0),
          },
        };
      }) as CreateProductOptionPayload[];

      const payload: CreateProductPayload = {
        nameTh: values.nameTh,
        nameEn: values.nameEn || undefined,
        descriptionTh: values.descriptionTh || undefined,
        descriptionEn: values.descriptionEn || undefined,
        unitType: values.unitType,
        unit: values.unit,
        categoryId: values.categoryId || undefined,
        branchId: values.branchId || branchIdFromSession,
        detailImageIds: detailImageIds.length ? detailImageIds : undefined,
        tags: values.tags?.length ? values.tags : undefined,
        isTaxInclusive: values.isTaxInclusive,
        taxClassId: values.taxClassId,
        taxRate: Number(values.taxRate ?? 0),
        variant: values.variant,
        productOptions,
      };

      console.log("Payload to send:", payload); // ✅ Debug log

      if (isEdit && productId) {
        const response = await updateProduct(productId, payload);
        if (!response.error) {
          router.replace("/dashboard/pos/products");
        }
      } else {
        const response = await createProduct(payload);
        if (!response.error) {
          router.replace("/dashboard/pos/products");
        }
      }
    },
  });

  if (loading) return <PageLoader />;

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
            <BlankCard>
              <BaseFileInput
                label="อัปโหลดภาพรายละเอียดสินค้า (3ไฟล์) (ไม่บังคับ)"
                placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
                multiple={true}
                accept={fileTypeGroup.image}
                maxFiles={3}
                autoUpload={true}
                toBucket={StorageBucket.PRODUCT_DETAIL}
                onUploadComplete={(files) => {
                  // ✅ รับ FileValue[]
                  formik.setFieldValue("detailImageIds", files);
                }}
                value={formik.values.detailImageIds}
              />
            </BlankCard>
          </Stack>
        </Grid>
        <Grid size={{ lg: 4 }}>
          <Stack spacing={3}>
            <BlankCard>
              <CategoryAndTags formik={formik} />
            </BlankCard>
            <BlankCard>
              <ProductTemplate formik={formik} />
            </BlankCard>
          </Stack>
        </Grid>

        {/* Desktop: ปุ่มด้านล่าง */}
        {!isMobile && (
          <Grid size={{ xs: 12 }}>
            <BlankCard>
              <Stack direction="row" spacing={2} justifyContent="space-between" p={2}>
                <BaseButton
                  preset="cancel"
                  label="ยกเลิก"
                  variant="outlined"
                  color="error"
                  href="/dashboard/pos/products"
                  fullWidth={false}
                  loading={formik.isSubmitting || isUploading}
                />
                <BaseButton
                  preset="save"
                  label={id ? "อัปเดต" : "บันทึก"}
                  type="submit"
                  variant="contained"
                  color="info"
                  loading={formik.isSubmitting || isUploading}
                  fullWidth={false}
                />
              </Stack>
            </BlankCard>
          </Grid>
        )}
      </Grid>

      {/* Mobile: Floating Buttons */}
      {isMobile && (
        <>
          <BaseFloatingButton preset="cancel" href="/dashboard/pos/products" disabled={formik.isSubmitting || isUploading} />
          <BaseFloatingButton preset="save" type="submit" disabled={formik.isSubmitting || isUploading} />
        </>
      )}
    </form>
  );
};

export default ProductForm;
