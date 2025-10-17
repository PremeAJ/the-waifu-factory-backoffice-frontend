"use client";
import React from "react";
import { Chip, ChipProps, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

interface BaseChipProps extends Omit<ChipProps, "color"> {
  preset?: "active" | "inactive" | "success" | "error" | "warning" | "info" | "primary" | "secondary" | "deleted" | "all";
  customColor?: string;
  customBgColor?: string;
}

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "customColor" && prop !== "customBgColor",
})<{ 
  customColor?: string; 
  customBgColor?: string; 
}>(({ theme, customColor, customBgColor }) => ({
  fontWeight: 500,
  fontSize: "0.75rem",
  height: 24,
  "& .MuiChip-label": {
    paddingLeft: 8,
    paddingRight: 8,
  },
  ...(customColor && customBgColor && {
    color: customColor,
    backgroundColor: customBgColor,
    "&:hover": {
      backgroundColor: customBgColor,
    },
  }),
}));

const BaseChip: React.FC<BaseChipProps> = ({
  preset,
  customColor,
  customBgColor,
  label,
  ...rest
}) => {
  const theme = useTheme();

  const getPresetConfig = () => {
    switch (preset) {
      case "active":
        return {
          color: "success" as const,
          label: label || "เปิดใช้งาน",
        };
      case "inactive":
        return {
          color: "error" as const,
          label: label || "ปิดใช้งาน",
        };
      case "deleted":
        return {
          color: "warning" as const,
          label: label || "ถูกลบ",
        };
      case "all":
        return {
          color: "info" as const,
          label: label || "ทั้งหมด",
        };
      case "success":
        return {
          color: "success" as const,
        };
      case "error":
        return {
          color: "error" as const,
        };
      case "warning":
        return {
          color: "warning" as const,
        };
      case "info":
        return {
          color: "info" as const,
        };
      case "primary":
        return {
          color: "primary" as const,
        };
      case "secondary":
        return {
          color: "secondary" as const,
        };
      default:
        return {};
    }
  };

  const presetConfig = getPresetConfig();

  return (
    <StyledChip
      label={presetConfig.label || label}
      color={presetConfig.color}
      size="small"
      customColor={customColor}
      customBgColor={customBgColor}
      {...rest}
    />
  );
};

export default BaseChip;