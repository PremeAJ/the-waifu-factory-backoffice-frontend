"use client";

import * as React from "react";
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { Grid, CardContent, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

// components
import BlankCard from "@/components/shared/BlankCard";
import ProfileSetting from "@/app/setting/(common)/account/profile/components/ProfileSetting";

const AccountSetting = () => {
  const { t } = useTranslation();

  const BCrumb = [
    {
      to: "/setting",
      title: t("Setting.Settings"),
    },
    {
      to: "/setting/account/profile",
      title: t("Setting.AccountSetting"),
    },
    {
      title: t("Setting.Profile"),
    },
  ];

  return (
    <PageContainer title={t("Setting.AccountSetting")} description="this is Account Setting">
      <Breadcrumb title={t("Setting.Profile")} items={BCrumb} />
      <BlankCard>
        <CardContent>
          <ProfileSetting />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default AccountSetting;
