"use client";
import { useMediaQuery, useTheme } from "@mui/material";
import { redirect } from "next/navigation";
import MobileSettingsList from "./components/MobileSettingsList";
import PageContainer from "@/components/container/PageContainer";
import { PageUrl } from "@/common/constants/pageUrl";

export default function SettingPage() {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.down("lg"));

  if (!isLg) {
    redirect(`${PageUrl.SETTING}/account/profile`);
  }

  return (
    <PageContainer title="Setting" description="This is setting">
      <MobileSettingsList />
    </PageContainer>
  );
}
