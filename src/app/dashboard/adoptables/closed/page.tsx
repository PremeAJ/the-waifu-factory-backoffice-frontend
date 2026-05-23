"use client";
import AdoptablesTable from "@/components/pages/adoptables/AdoptablesTable";
import PageContainer from "@/components/container/PageContainer";
import Typography from "@mui/material/Typography";

export default function AdoptablesClosedPage() {
  return (
    <PageContainer title="Closed Adoptables" description="Closed adoptables">
      <Typography variant="h4" mb={3}>Closed Adoptables</Typography>
      <AdoptablesTable status="closed" />
    </PageContainer>
  );
}
