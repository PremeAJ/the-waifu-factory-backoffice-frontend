"use client";
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import { IsLanguage } from "@/common/contexts/ProfileContext/interfaces/interface";

const Languages: {
  label: string;
  icon: string;
  value: IsLanguage;
}[] = [
  {
    label: "TH",
    icon: "/images/flag/icon-flag-th.svg",
    value: "th",
  },
  {
    label: "EN",
    icon: "/images/flag/icon-flag-en.svg",
    value: "en",
  },
];

const SwitchBox = styled(Box)(({ theme }) => ({
  width: 56,
  height: 22,
  borderRadius: 6,
  background: theme.palette.grey[200],
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 4px",
  position: "relative",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  cursor: "pointer",
  userSelect: "none",
}));

const FlagAvatar = styled(Avatar)({
  width: "100%",
  height: "100%",
  borderRadius: 4,
  background: "transparent",
  boxShadow: "none",
});

const Thumb = styled(Box, {
  shouldForwardProp: (prop) => prop !== "checked",
})<{ checked: boolean }>(({ checked }) => ({
  position: "absolute",
  top: 1,
  left: checked ? 28 : 1,
  width: 24,
  height: 20,
  borderRadius: 4,
  background: "#fff",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  transition: "left 0.2s",
  zIndex: 2,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const SwitchLanguage = () => {
  const [checked, setChecked] = React.useState(false);

  const handleToggle = () => setChecked((prev) => !prev);

  return (
    <SwitchBox onClick={handleToggle}>
      <Typography
        variant="caption"
        sx={{
          color: checked ? "text.secondary" : "text.primary",
          fontWeight: 500,
          zIndex: 1,
          marginLeft: 0.5,
          transition: "color 0.2s",
          fontSize: 11,
        }}
      >
        {Languages[1].label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: checked ? "text.primary" : "text.secondary",
          fontWeight: 500,
          zIndex: 1,
          marginRight: 0.5,
          transition: "color 0.2s",
          fontSize: 11,
        }}
      >
        {Languages[0].label}
      </Typography>
      <Thumb checked={checked}>
        <FlagAvatar variant="square" src={checked ? Languages[1].icon : Languages[0].icon} alt={checked ? Languages[1].label : Languages[0].label} />
      </Thumb>
    </SwitchBox>
  );
};

export default SwitchLanguage;
