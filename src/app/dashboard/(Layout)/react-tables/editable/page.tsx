import * as React from "react";

import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";

import TableEditable from "@/components/react-table/TableEditable";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Editable React Table",
  },
];

const EditableTable = () => {
  return (
    <PageContainer title="Editable Table" description="this is Editable Table">
      {/* breadcrumb */}
      <Breadcrumb title="Editable Table" items={BCrumb} />
      {/* end breadcrumb */}
      <TableEditable />
    </PageContainer>
  );
};
export default EditableTable;
