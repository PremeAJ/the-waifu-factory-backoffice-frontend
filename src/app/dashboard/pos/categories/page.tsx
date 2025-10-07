import { CategoriesProvider } from "@/common/contexts/CategoriesContext";
import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import CategoriesList from "./components/CategoriesList";
import PageContainer from "@/components/container/PageContainer";
import React from "react";
import BaseCardContent from "@/common/components/base/BaseCardContent";

const BCrumb = [{ to: "/", title: "POS" }, { title: "Categories" }];
const CategoriesPage = () => {
  return (
    <PageContainer title="Categories" description="Categories">
      <Breadcrumb title="Categories" items={BCrumb} />
      <BlankCard>
        <BaseCardContent>
          <CategoriesProvider>
            <CategoriesList />
          </CategoriesProvider>
        </BaseCardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default CategoriesPage;
