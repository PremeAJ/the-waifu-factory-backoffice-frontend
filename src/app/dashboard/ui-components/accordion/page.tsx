import * as React from "react";
import { Grid } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ParentCard from "@/components/shared/ParentCard";
import Basic from "@/components/ui-components/accordion/Basic";
import Controlled from "@/components/ui-components/accordion/Controlled";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Accordion",
  },
];

const MuiAccordion = () => {
  return (
    (<PageContainer title="Accordian" description="this is Accordian">
      {/* breadcrumb */}
      <Breadcrumb title="Accordion" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Accordion">
        <Grid container spacing={3}>
          <Grid display="flex" alignItems="stretch" size={12}>
            <Basic />
          </Grid>
          <Grid display="flex" alignItems="stretch" size={12}>
            <Controlled />
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>)
  );
};
export default MuiAccordion;
