"use client";
import React, { useEffect, useState } from "react";
import { Button, Grid, Stack } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import VariationCard from "@/components/apps/ecommerce/productAdd/VariationCard";
import PricingCard from "@/components/apps/ecommerce/productAdd/Pricing";
import StatusCard from "@/components/apps/ecommerce/productAdd/Status";
import ProductDetails from "@/components/apps/ecommerce/productAdd/ProductDetails";
import ProductTemplate from "@/components/apps/ecommerce/productAdd/ProductTemplate";
import BlankCard from "@/components/shared/BlankCard";
import { ProductProvider } from "@/context/Ecommercecontext/index";
import BaseFileInput from "@/common/components/base/BaseFileInput";
import { FileSize } from "@/common/constants/file/fileSize";
import { fileTypeGroup } from "@/common/constants/file/fileType";
import { useParams, useRouter } from "next/navigation";
import PageLoader from "@/common/components/loaders/PageLoader";
import GeneralCard from "./components/GeneralCard";

const BCrumb = [
  {
    title: "POS",
  },
  {
    to: "/dashboard/pos/products",
    title: "Products",
  },
];

const AddOrEditProduct = () => {
  const params = useParams() as { action?: string };
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const action = params?.action;

  useEffect(() => {
    // validate action param: allow only "create" or "edit"
    if (!action) {
      router.replace("/dashboard/pos/products");
      return;
    }

    if (action !== "create" && action !== "edit") {
      // invalid action -> redirect to products list
      router.replace("/dashboard/pos/products");
      return;
    }

    // if edit mode you might require additional validation (e.g. product id)
    // e.g. const search = useSearchParams(); const id = search.get('id');
    // if (!id) router.replace('/dashboard/pos/products');

    setReady(true);
  }, [action, router]);

  if (!ready) return <PageLoader />;

  const title = action === "create" ? "Add Product" : "Edit Product";
  const crumb = [...BCrumb, { title }];

  return (
    <ProductProvider>
      <PageContainer title={title} description={title}>
        <Breadcrumb title={title} items={crumb} />
        <form>
          <Grid container spacing={3}>
            <Grid
              size={{
                lg: 8,
              }}
            >
              <Stack spacing={3}>
                <BlankCard>
                  <GeneralCard />
                </BlankCard>
                <BlankCard>
                  <BaseFileInput
                    label="อัปโหลดภาพสินค้า"
                    placeholder="เลือกภาพสินค้า (JPG, PNG, สูงสุด 2MB)"
                    multiple={false}
                    accept={fileTypeGroup.image}
                    maxSize={FileSize.MB2}
                    onChange={(files) => {
                      console.log(files);
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
                      console.log(files);
                    }}
                  />
                </BlankCard>

                <BlankCard>
                  <VariationCard />
                </BlankCard>

                <BlankCard>
                  <PricingCard />
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
                  <StatusCard />
                </BlankCard>

                <BlankCard>
                  <ProductDetails />
                </BlankCard>

                <BlankCard>
                  <ProductTemplate />
                </BlankCard>
              </Stack>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
            <Button variant="outlined" color="error">
              Cancel
            </Button>
          </Stack>
        </form>
      </PageContainer>
    </ProductProvider>
  );
};

export default AddOrEditProduct;
