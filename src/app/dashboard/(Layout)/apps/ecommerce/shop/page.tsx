import React from "react";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ProductShop from "@/components/apps/ecommerce/productGrid";
import AppCard from "@/components/shared/AppCard";
import { ProductProvider } from '@/context/Ecommercecontext/index'


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shop",
  },
];
const Ecommerce = () => {
  return (
    <ProductProvider>
      <PageContainer title="Shop" description="this is Shop">
        {/* breadcrumb */}
        <Breadcrumb title="Shop" items={BCrumb} />
        <AppCard>
          <ProductShop />
        </AppCard>
      </PageContainer>
    </ProductProvider>
  );
};

export default Ecommerce;
