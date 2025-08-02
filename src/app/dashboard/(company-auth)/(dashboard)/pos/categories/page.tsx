import React from "react";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import { InvoiceProvider } from "@/context/InvoiceContext/index";
import BlankCard from "@/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import CategoriesList from "./components/CategoriesList";

const BCrumb = [
  {
    to: "/",
    title: "POS",
  },
  {
    title: "Categories",
  },
];

const InvoiceListing = () => {
  return (
    <CategoriesProvider>
      <InvoiceProvider>
        <PageContainer title="Categories" description="this is Categories">
          <Breadcrumb title="Categories" items={BCrumb} />
          <BlankCard>
            <CardContent>
              <CategoriesList />
            </CardContent>
          </BlankCard>
        </PageContainer>
      </InvoiceProvider>
    </CategoriesProvider>
  );
};
export default InvoiceListing;
