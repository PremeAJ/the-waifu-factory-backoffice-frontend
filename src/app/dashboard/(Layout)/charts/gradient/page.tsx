import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/app/dashboard/(Layout)/layout/shared/breadcrumb/Breadcrumb";

import React from "react";
import ApexGradient from "@/components/charts/ApexGradient";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Gradient Chart",
  },
];

const Gradient = () => {
  return (
    <PageContainer title="Gradient Chart" description="this is Gradient Chart">
      {/* breadcrumb */}
      <Breadcrumb title="Gradient Chart" items={BCrumb} />
      {/* end breadcrumb */}
      <ApexGradient />
    </PageContainer>
  );
};

export default Gradient;
