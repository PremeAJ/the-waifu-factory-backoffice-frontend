"use client";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider } from "@/common/contexts/ProductsContext";
import { TaxProvider } from "@/common/contexts/Master/TaxContext";
import BaseCardContent from "@/common/components/base/BaseCardContent";
import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ProductsList from "./components/ProductsList";
import React from "react";

const BCrumb = [{ title: "POS" }, { title: "Products" }];

export default function ProductsPageClient() {
  return (
    <PageContainer title="Products" description="Products">
      <Breadcrumb title="Products" items={BCrumb} />
      <BlankCard>
        <BaseCardContent>
          <ProductsProvider>
            <TaxProvider>
              <CategoriesProvider>
                <ProductsList />
              </CategoriesProvider>
            </TaxProvider>
          </ProductsProvider>
        </BaseCardContent>
      </BlankCard>
    </PageContainer>
  );
}
