import { CardContent } from "@mui/material";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import React from "react";
import CategoriesList from "./components/CategoriesList";

const BCrumb = [{ title: "POS" }, { title: "Products" }];
const ProductsPage = () => {
  return (
    <PageContainer title="Products" description="Products">
      <Breadcrumb title="Products" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <CategoriesProvider>
              <CategoriesList />
          </CategoriesProvider>
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default ProductsPage;
