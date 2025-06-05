import { Grid } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ParentCard from "@/components/shared/ParentCard";
import ChildCard from "@/components/shared/ChildCard";
import BasicTransferList from "@/components/ui-components/transfer-list/BasicTransferList";
import EnhancedTransferList from "@/components/ui-components/transfer-list/EnhancedTransferList";

import BasicTransferListCode from "@/components/ui-components/transfer-list/code/BasicTransferListCode";
import EnhancedTransferListCode from "@/components/ui-components/transfer-list/code/EnhancedTransferListCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Transfer List",
  },
];

const MuiTransferList = () => (
  <PageContainer title="Transfer List" description="this is Transfer List">
    {/* breadcrumb */}
    <Breadcrumb title="Transfer List" items={BCrumb} />
    {/* end breadcrumb */}

    <ParentCard title="Transfer List">
      <Grid container spacing={3}>
        <Grid display="flex" alignItems="stretch" size={12}>
          <ChildCard title="Basic" codeModel={<BasicTransferListCode />}>
            <BasicTransferList />
          </ChildCard>
        </Grid>
        <Grid display="flex" alignItems="stretch" size={12}>
          <ChildCard title="Enhanced" codeModel={<EnhancedTransferListCode />}>
            <EnhancedTransferList />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiTransferList;
