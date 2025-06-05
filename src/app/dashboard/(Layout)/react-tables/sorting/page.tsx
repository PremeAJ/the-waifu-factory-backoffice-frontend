import * as React from "react";

import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";

import TableSorting from "@/components/react-table/TableSorting";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sorting React Table",
  },
];

const ReactSortingTable = () => {
  return (
    <PageContainer title="Sorting Table" description="this is Sorting Table">
      {/* breadcrumb */}
      <Breadcrumb title="Sorting Table" items={BCrumb} />
      {/* end breadcrumb */}
      <TableSorting />
    </PageContainer>
  );
};

export default ReactSortingTable;
