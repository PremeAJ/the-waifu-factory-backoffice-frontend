import { CardContent } from "@mui/material";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { ProductsProvider } from "@/common/contexts/ProductsContext";
import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import CategoriesList from "./components/ProductsList";
import PageContainer from "@/components/container/PageContainer";
import React from "react";

const BCrumb = [{ title: "POS" }, { title: "Products" }];
const ProductsPage = () => {
  return (
    <PageContainer title="Products" description="Products">
      <Breadcrumb title="Products" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <ProductsProvider>
            <CategoriesProvider>
              <CategoriesList />
            </CategoriesProvider>
          </ProductsProvider>
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default ProductsPage;
