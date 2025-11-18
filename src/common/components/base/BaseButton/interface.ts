import { ButtonProps } from "@mui/material";

export interface PresetButtonConfig {
  label: string;
  color: "primary" | "error" | "inherit" | "secondary" | "success" | "info" | "warning";
  variant: "contained" | "outlined" | "text";
  size: "small" | "medium" | "large";
  icon?: React.ReactNode;
}

export type PresetType = "default" | "save" | "cancel" | "edit" | "add";

export interface BaseButtonProps extends ButtonProps {
  label?: string;
  preset?: PresetType;
}