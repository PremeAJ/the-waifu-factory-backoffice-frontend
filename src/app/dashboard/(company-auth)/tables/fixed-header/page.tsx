import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";

import TableFixedHeader from "@/components/tables/TableFixedHeader";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Fixed Header Table",
  },
];

const FixedHeaderTable = () => {
  return (
    <PageContainer
      title="Fixed Header Table"
      description="this is Fixed Header Table"
    >
      {/* breadcrumb */}
      <Breadcrumb title="Fixed Header Table" items={BCrumb} />
      {/* end breadcrumb */}
      <TableFixedHeader />
    </PageContainer>
  );
};

export default FixedHeaderTable;
