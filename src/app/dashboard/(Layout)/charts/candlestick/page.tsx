import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/app/dashboard/(Layout)/layout/shared/breadcrumb/Breadcrumb";
import React from "react";
import ApexCandlestick from "@/components/charts/ApexCandlestick";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Candlestick Chart",
  },
];

const CandlestickChart = () => {
  return (
    <PageContainer
      title="Candlestick Chart"
      description="this is Candlestick Chart"
    >
      {/* breadcrumb */}
      <Breadcrumb title="Candlestick Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexCandlestick />
    </PageContainer>
  );
};

export default CandlestickChart;
