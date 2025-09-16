"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { redirect } from "next/navigation";
import MobileSettingsList from "./components/MobileSettingsList";
import PageContainer from "@/components/container/PageContainer";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import { useEffect } from "react";

export default function SettingPage() {
  const isMobile = useIsMobile();
  if (!isMobile) {
    redirect(`${PageUrl.SETTING}/account/profile`);
  }

  return (
    <PageContainer title="Setting" description="This is setting">
      <MobileSettingsList />
    </PageContainer>
  );
}
