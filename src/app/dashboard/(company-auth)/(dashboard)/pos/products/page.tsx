import { CardContent } from "@mui/material";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import { InvoiceProvider } from "@/context/InvoiceContext/index";
import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import CategoriesList from "./components/CategoriesList";
import PageContainer from "@/components/container/PageContainer";
import React from "react";

const BCrumb = [{ to: "/", title: "POS" }, { title: "Products" }];
const ProductsPage = () => {
  return (
    <PageContainer title="Products" description="this is Products">
      <Breadcrumb title="Products" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <CategoriesProvider>
            <InvoiceProvider>
              <CategoriesList />
            </InvoiceProvider>
          </CategoriesProvider>
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default ProductsPage;
