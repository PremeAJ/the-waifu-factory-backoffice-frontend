"use client";
import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

export type BaseTabItem = {
  id?: string | number;
  label: React.ReactNode;
  icon?: React.ReactElement | null;
  disabled?: boolean;
  // any extra props passed to individual Tab
  tabProps?: Record<string, any>;
};

type BaseTabsProps = {
  value: number;
  onChange: (event: React.SyntheticEvent, value: number) => void;
  tabs: BaseTabItem[];
  variant?: "standard" | "scrollable" | "fullWidth";
  // keep flexible to match different MUI versions
  scrollButtons?: any;
  textColor?: "primary" | "secondary" | "inherit";
  indicatorColor?: "primary" | "secondary" | "primaryOutlined";
  centered?: boolean;
  sx?: any;
};

export const a11yProps = (index: number) => ({
  id: `base-tab-${index}`,
  "aria-controls": `base-tabpanel-${index}`,
});

export const BaseTabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number; sx?: any }> = ({ children, index, value, sx }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`base-tabpanel-${index}`} aria-labelledby={`base-tab-${index}`} style={{ width: "100%" }}>
      {value === index && <Box sx={sx}>{children}</Box>}
    </div>
  );
};

const BaseTabs: React.FC<BaseTabsProps> = ({
  value,
  onChange,
  tabs,
  variant = "standard",
  scrollButtons = "auto",
  textColor = "primary",
  indicatorColor = "primary",
  centered = false,
  sx,
}) => {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant={variant}
      // cast to any to support different @mui/material versions
      scrollButtons={scrollButtons as any}
      textColor={textColor}
      indicatorColor={indicatorColor as any}
      centered={centered}
      sx={sx}
      aria-label="base-tabs"
    >
      {tabs.map((t, i) => (
        <Tab
          key={t.id ?? i}
          // cast label/icon to satisfy Tab typing across MUI versions
          label={t.label as any}
          icon={t.icon ? (t.icon as React.ReactElement) : undefined}
          iconPosition={t.icon ? "start" : undefined}
          disabled={t.disabled}
          {...a11yProps(i)}
          {...t.tabProps}
        />
      ))}
    </Tabs>
  );
};

export default BaseTabs;
