"use client";
import { CasheirProvider } from "@/common/contexts/CasheirContext";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider } from "@/common/contexts/ProductsContext";
import { TaxProvider } from "@/common/contexts/Master/TaxContext";
import BaseCardContent from "@/common/components/base/BaseCardContent";
import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ProductsList from "./components/ProductsList";
import React from "react";

const BCrumb = [{ title: "POS" }, { title: "สินค้า" }];

export default function ProductsPageClient() {
  return (
    <PageContainer title="สินค้า" description="Products">
      <Breadcrumb title="สินค้า" items={BCrumb} />
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
