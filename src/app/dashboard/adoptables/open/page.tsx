"use client";
import AdoptablesTable from "@/components/pages/adoptables/AdoptablesTable";
import PageContainer from "@/components/container/PageContainer";
import Typography from "@mui/material/Typography";

export default function AdoptablesOpenPage() {
  return (
    <PageContainer title="Open Adoptables" description="Adoptables currently open">
      <Typography variant="h4" mb={3}>Open Adoptables</Typography>
      <AdoptablesTable status="open" />
    </PageContainer>
  );
}
