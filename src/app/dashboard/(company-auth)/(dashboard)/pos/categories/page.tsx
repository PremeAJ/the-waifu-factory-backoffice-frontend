import React from "react";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import InvoiceList from "@/components/apps/invoice/Invoice-list/index";
import { InvoiceProvider } from "@/context/InvoiceContext/index";
import BlankCard from "@/components/shared/BlankCard";
import { CardContent } from "@mui/material";

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
    <InvoiceProvider>
      <PageContainer title="Categories" description="this is Categories">
        <Breadcrumb title="Categories" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <InvoiceList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </InvoiceProvider>
  );
}
export default InvoiceListing;
