"use client";
import AdoptablesTable from "@/components/pages/adoptables/AdoptablesTable";
import PageContainer from "@/components/container/PageContainer";
import Typography from "@mui/material/Typography";

export default function AdoptablesPendingPage() {
  return (
    <PageContainer title="Pending Adoptables" description="Adoptables awaiting approval">
      <Typography variant="h4" mb={3}>Pending Adoptables</Typography>
      <AdoptablesTable status="pending" />
    </PageContainer>
  );
}
