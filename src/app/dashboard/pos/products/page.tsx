"use client";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider } from "@/common/contexts/ProductsContext";
import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import ProductsList from "./components/ProductsList";
import PageContainer from "@/components/container/PageContainer";
import React from "react";
import BaseCardContent from "@/common/components/base/BaseCardContent";

const BCrumb = [{ title: "POS" }, { title: "Products" }];
const ProductsPage = () => {
  return (
    <PageContainer title="Products" description="Products">
      <Breadcrumb title="Products" items={BCrumb} />
      <BlankCard>
        <BaseCardContent >
          <ProductsProvider>
            <CategoriesProvider>
              <ProductsList />
            </CategoriesProvider>
          </ProductsProvider>
        </BaseCardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default ProductsPage;
