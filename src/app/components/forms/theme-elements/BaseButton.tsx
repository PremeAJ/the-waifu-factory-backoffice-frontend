import Button, { ButtonProps } from "@mui/material/Button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconPencil, IconX, IconDeviceFloppy } from "@tabler/icons-react";

interface PresetButtonConfig {
  label: string;
  color: "primary" | "error" | "inherit" | "secondary" | "success" | "info" | "warning";
  variant: "contained" | "outlined" | "text";
  size: "small" | "medium" | "large";
  icon?: React.ReactNode;
}

type PresetType = "default" | "save" | "cancel" | "edit";
interface BaseButtonProps extends ButtonProps {
  label?: string;
  preset?: PresetType;
}

const presetMap: Record<PresetType, PresetButtonConfig> = {
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
    icon: <IconDeviceFloppy size={20} />,
  },
  cancel: {
    label: "Cancel",
    color: "error",
    variant: "text",
    size: "large",
    icon: <IconX size={20} />,
  },
  edit: {
    label: "Edit",
    color: "primary",
    variant: "text",
    size: "large",
    icon: <IconPencil size={20} />,
  },
};

const BaseButton = ({ label, preset = "default", ...rest }: BaseButtonProps) => {
  const { t } = useTranslation();

  // ถ้า label ถูกส่งมาใช้ label นั้น, ถ้าไม่ส่งมาใช้ label จาก presetMap และแปลด้วย t
  const displayLabel = label ?? t(`button.${preset}`, presetMap[preset].label);

  return (
    <Button
      color={presetMap[preset].color}
      variant={presetMap[preset].variant}
      size={presetMap[preset].size}
      fullWidth
      startIcon={presetMap[preset].icon}
      {...(rest.href ? { component: Link } : {})}
      {...rest}
      sx={{
        transition: "all 0.18s",
        "&:hover": {
          transform: "scale(1.07)",
        },
        "&:active": {
          transform: "scale(0.96)",
        },
        ...rest.sx,
      }}
    >
      {displayLabel}
    </Button>
  );
};
export default BaseButton;
