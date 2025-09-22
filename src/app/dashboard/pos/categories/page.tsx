import { CardContent } from "@mui/material";
import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import CategoriesList from "./components/CategoriesList";
import PageContainer from "@/components/container/PageContainer";
import React from "react";

const BCrumb = [{ to: "/", title: "POS" }, { title: "Categories" }];
const CategoriesPage = () => {
  return (
    <PageContainer title="Categories" description="Categories">
      <Breadcrumb title="Categories" items={BCrumb} />
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
export default CategoriesPage;
