import Button, { ButtonProps } from "@mui/material/Button";
import Link from "next/link";

interface PresetButtonConfig {
  label: string;
  color: "primary" | "error" | "inherit" | "secondary" | "success" | "info" | "warning";
  variant: "contained" | "outlined" | "text";
  size: "small" | "medium" | "large";
}

interface BaseButtonProps extends ButtonProps {
  label?: string;
  preset?: "default" | "save" | "cancel";
}

const presetMap: Record<"default" | "save" | "cancel", PresetButtonConfig> = {
  default: {
    label: "Button",
    color: "primary",
    variant: "contained",
    size: "large",
  },
  save: {
    label: "Save",
    color: "primary",
    variant: "contained",
    size: "large",
  },
  cancel: {
    label: "Cancel",
    color: "error",
    variant: "text",
    size: "large",
  },
};

const BaseButton = ({ label, preset = "default", ...rest }: BaseButtonProps) => {
  return (
    <Button
      color={presetMap[preset].color}
      variant={presetMap[preset].variant}
      size={presetMap[preset].size}
      fullWidth
      {...(rest.href ? { component: Link } : {})}
      {...rest}
    >
      {label ?? presetMap[preset].label}
    </Button>
  );
};
export default BaseButton;
