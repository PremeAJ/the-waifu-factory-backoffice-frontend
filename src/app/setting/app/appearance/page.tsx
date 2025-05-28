"use client";

import * as React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/dashboard/(Layout)/layout/shared/breadcrumb/Breadcrumb";
import { Box, Typography, Divider, Stack, Button, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useContext } from "react";
import { CustomizerContext } from "@/app/context/setting/customizerContext";

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
  // ดึง state และ set function จาก CustomizerContext
  const {
    activeTheme,
    setActiveTheme,
    activeMode,
    setActiveMode,
    activeLayout,
    setActiveLayout,
    // ...เพิ่ม state/setState อื่นๆ ตามที่ Customizer มี...
  } = useContext(CustomizerContext);

  return (
    <PageContainer title="Appearance" description="this is setting appearance">
      <Breadcrumb title="Appearance" items={BCrumb} />
      <Box mt={3}>
        <Typography variant="h4" mb={2}>Appearance Settings</Typography>
        <Divider sx={{ mb: 3 }} />

        {/* ตัวอย่าง Theme Selector */}
        <Typography variant="h6" mb={1}>Theme</Typography>
        <ToggleButtonGroup
          value={activeTheme}
          exclusive
          onChange={(_, value) => value && setActiveTheme(value)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="BLUE_THEME">Blue</ToggleButton>
          <ToggleButton value="AQUA_THEME">Aqua</ToggleButton>
          <ToggleButton value="PURPLE_THEME">Purple</ToggleButton>
          {/* เพิ่ม theme อื่นๆ */}
        </ToggleButtonGroup>

        {/* ตัวอย่าง Mode Selector */}
        <Typography variant="h6" mb={1}>Mode</Typography>
        <ToggleButtonGroup
          value={activeMode}
          exclusive
          onChange={(_, value) => value && setActiveMode(value)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="light">Light</ToggleButton>
          <ToggleButton value="dark">Dark</ToggleButton>
        </ToggleButtonGroup>

        {/* ตัวอย่าง Layout Selector */}
        <Typography variant="h6" mb={1}>Layout</Typography>
        <ToggleButtonGroup
          value={activeLayout}
          exclusive
          onChange={(_, value) => value && setActiveLayout(value)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="vertical">Vertical</ToggleButton>
          <ToggleButton value="horizontal">Horizontal</ToggleButton>
        </ToggleButtonGroup>

        {/* เพิ่ม section อื่นๆ ตามที่ Customizer มี */}
      </Box>
    </PageContainer>
  );
};

export default AppearanceSetting;
