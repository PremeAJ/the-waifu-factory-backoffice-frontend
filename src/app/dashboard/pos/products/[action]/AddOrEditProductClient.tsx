"use client";
import React from "react";
import { useSearchParams } from "next/navigation"; // (ยังเผื่อใช้ใน descendant)
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider } from "@/common/contexts/ProductsContext";
import { TaxProvider } from "@/common/contexts/Master/TaxContext";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ProductForm from "./components/ProductForm";

export default function AddOrEditProductClient({ title, crumb }: { title: string; crumb: any[] }) {
  return (
    <ProductsProvider>
      <CategoriesProvider>
        <TaxProvider>
          <PageContainer title={title} description={title}>
            <Breadcrumb title={title} items={crumb} />
            <ProductForm />
          </PageContainer>
        </TaxProvider>
      </CategoriesProvider>
    </ProductsProvider>
  );
}