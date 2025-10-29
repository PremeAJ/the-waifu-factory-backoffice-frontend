"use client";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ProductForm from "./components/ProductForm";
import React from "react";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider } from "@/common/contexts/ProductsContext";

export default function AddOrEditProductClient({ title, crumb }: { title: string; crumb: any[] }) {
  return (
    <ProductsProvider>
      <CategoriesProvider>
        <PageContainer title={title} description={title}>
          <Breadcrumb title={title} items={crumb} />
          <ProductForm />
        </PageContainer>
      </CategoriesProvider>
    </ProductsProvider>
  );
}