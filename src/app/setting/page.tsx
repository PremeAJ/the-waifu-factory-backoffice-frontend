"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { redirect } from "next/navigation";
import MobileSettingsList from "./components/MobileSettingsList";
import PageContainer from "@/components/container/PageContainer";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsPWA from "@/common/utils/state/useIsPWA";
import { Grid } from "@mui/material";

export default function SettingPage() {
  const isPWA = useIsPWA();

  const isMobile = useIsMobile();
  if (!isMobile) {
    // redirect(`${PageUrl.SETTING}/account/profile`);
  }

  return (
    <PageContainer title="Setting" description="This is setting">
      <Grid>
        <MobileSettingsList />
      </Grid>
    </PageContainer>
  );
}
