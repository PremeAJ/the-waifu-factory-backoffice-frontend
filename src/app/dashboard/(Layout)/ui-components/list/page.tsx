import { Grid } from "@mui/material";
import Breadcrumb from "@/app/dashboard/(Layout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ParentCard from "@/components/shared/ParentCard";
import ChildCard from "@/components/shared/ChildCard";

import SimpleList from "@/components/ui-components/lists/SimpleList";
import NestedList from "@/components/ui-components/lists/NestedList";
import FolderList from "@/components/ui-components/lists/FolderList";
import SelectedList from "@/components/ui-components/lists/SelectedList";
import ControlsList from "@/components/ui-components/lists/ControlsList";
import SwitchList from "@/components/ui-components/lists/SwitchList";
import React from "react";

import SimpleListCode from "@/components/ui-components/lists/code/SimpleListCode";
import NestedListCode from "@/components/ui-components/lists/code/NestedListCode";
import FolderListCode from "@/components/ui-components/lists/code/FolderListCode";
import SelectedListCode from "@/components/ui-components/lists/code/SelectedListCode";
import ControlsListCode from "@/components/ui-components/lists/code/ControlsListCode";
import SwitchListCode from "@/components/ui-components/lists/code/SwitchListCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "List",
  },
];

const MuiList = () => (
  <PageContainer title="List" description="this is List">
    {/* breadcrumb */}
    <Breadcrumb title="List" items={BCrumb} />
    {/* end breadcrumb */}

    <ParentCard title="List">
      <Grid container spacing={3}>
        <Grid
          display="flex"
          alignItems="stretch"
          size={{
            xs: 12,
            sm: 6
          }}>
          <ChildCard title="Simple" codeModel={<SimpleListCode />}>
            <SimpleList />
          </ChildCard>
        </Grid>
        <Grid
          display="flex"
          alignItems="stretch"
          size={{
            xs: 12,
            sm: 6
          }}>
          <ChildCard title="Nested" codeModel={<NestedListCode />}>
            <NestedList />
          </ChildCard>
        </Grid>
        <Grid
          display="flex"
          alignItems="stretch"
          size={{
            xs: 12,
            sm: 6
          }}>
          <ChildCard title="Folder" codeModel={<FolderListCode />}>
            <FolderList />
          </ChildCard>
        </Grid>
        <Grid
          display="flex"
          alignItems="stretch"
          size={{
            xs: 12,
            sm: 6
          }}>
          <ChildCard title="Selected" codeModel={<SelectedListCode />}>
            <SelectedList />
          </ChildCard>
        </Grid>
        <Grid
          display="flex"
          alignItems="stretch"
          size={{
            xs: 12,
            sm: 6
          }}>
          <ChildCard title="Controls" codeModel={<ControlsListCode />}>
            <ControlsList />
          </ChildCard>
        </Grid>
        <Grid
          display="flex"
          alignItems="stretch"
          size={{
            xs: 12,
            sm: 6
          }}>
          <ChildCard title="Switch" codeModel={<SwitchListCode />}>
            <SwitchList />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiList;
