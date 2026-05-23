"use client";
import AdoptablesTable from "@/components/pages/adoptables/AdoptablesTable";
import PageContainer from "@/components/container/PageContainer";
import Typography from "@mui/material/Typography";

export default function AdoptablesPage() {
  return (
    <PageContainer title="Adoptables" description="All Adoptables">
      <Typography variant="h4" mb={3}>Adoptables</Typography>
      <AdoptablesTable />
    </PageContainer>
  );
}
