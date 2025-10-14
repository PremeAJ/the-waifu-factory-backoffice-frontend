"use client";

import * as React from "react";
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { Typography, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import ThemeColors from "./components/ThemeColors";
import ThemeMode from "./components/ThemeMode";
import BlankCard from "@/components/shared/BlankCard";
import Border from "./components/Border";
import Others from "./components/Others";

const BCrumb = [
  {
    to: "/setting/account/profile",
    title: "Setting",
  },
  {
    title: "Appearance",
  },
];

const AppearanceSetting = () => {

  return (
    <PageContainer title="Appearance" description="this is setting appearance">
      <Breadcrumb title="Appearance" items={BCrumb} />
      <BlankCard>
        <Box p={3} borderRadius={2}>
          <Typography variant="h4" mb={2}>
            Appearance Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Theme Option
          </Typography>
          <ThemeMode />
          <Typography variant="h6" gutterBottom mt={5}>
            Theme Colors
          </Typography>
          <ThemeColors />
          <Typography variant="h6" gutterBottom mt={5}>
            Border
          </Typography>
          <Border />
          <Typography variant="h6" gutterBottom mt={5}>
            Others
          </Typography>
          <Others />
        </Box>
      </BlankCard>
    </PageContainer>
  );
};

export default AppearanceSetting;
