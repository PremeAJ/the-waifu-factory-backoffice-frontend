import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";

import React from "react";
import ApexLine from "@/components/charts/ApexLine";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Line Chart",
  },
];

const LineChart = () => {
  return (
    <PageContainer title="Line Chart" description="this is Line Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Line Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexLine />
    </PageContainer>
  );
};

export default LineChart;
