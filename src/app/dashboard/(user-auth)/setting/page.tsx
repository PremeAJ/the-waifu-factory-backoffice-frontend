"use client";
import { useMediaQuery, useTheme } from "@mui/material";
import { redirect } from "next/navigation";
import MobileSettingsList from "./layout/MobileSettingsList";
import PageContainer from "@/components/container/PageContainer";

export default function SettingPage() {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.down("lg"));

  if (!isLg) {
    redirect("/dashboard/setting/account/profile");
  }

  return (
    <PageContainer title="Setting" description="This is setting">
      <MobileSettingsList />
    </PageContainer>
  );
}
