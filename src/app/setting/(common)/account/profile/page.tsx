"use client";

import * as React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/dashboard/(Layout)/layout/shared/breadcrumb/Breadcrumb";
import { Grid, CardContent, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

// components
import BlankCard from "@/app/components/shared/BlankCard";
import AccountTab from "@/app/components/settings/account-setting/AccountTab";

const AccountSetting = () => {
  const { t } = useTranslation();

  const BCrumb = [
    {
      to: "/setting/account/profile",
      title: t("Setting.AccountSetting"),
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
          <AccountTab />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default AccountSetting;
