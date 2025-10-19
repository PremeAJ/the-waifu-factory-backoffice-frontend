"use client";
import { ProductProvider } from "@/context/Ecommercecontext/index";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import PageLoader from "@/common/components/loaders/PageLoader";
import ProductForm from "./components/ProductForm";
import React, { useEffect, useState } from "react";

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
    if (!action) {
      router.replace("/dashboard/pos/products");
      return;
    }

    if (action !== "create" && action !== "edit") {
      router.replace("/dashboard/pos/products");
      return;
    }

    setReady(true);
  }, [action, router]);

  if (!ready) return <PageLoader />;

  const title = action === "create" ? "Add Product" : "Edit Product";
  const crumb = [...BCrumb, { title }];

  return (
    <ProductProvider>
      <PageContainer title={title} description={title}>
        <Breadcrumb title={title} items={crumb} />
        <ProductForm />
      </PageContainer>
    </ProductProvider>
  );
};

export default AddOrEditProduct;
