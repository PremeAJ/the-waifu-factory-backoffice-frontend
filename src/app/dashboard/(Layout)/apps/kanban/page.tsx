import React from "react";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import TaskManager from "@/components/apps/kanban/TaskManager";
import { KanbanDataContextProvider } from "@/context/kanbancontext/index";
import BlankCard from "@/components/shared/BlankCard";
import { CardContent } from "@mui/material";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Kanban",
  },
];

function page() {
  return (
    <KanbanDataContextProvider>
      <PageContainer title="Kanban App" description="this is Kanban App">
        <Breadcrumb title="Kanban app" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <TaskManager />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </KanbanDataContextProvider>
  );
}

export default page;
