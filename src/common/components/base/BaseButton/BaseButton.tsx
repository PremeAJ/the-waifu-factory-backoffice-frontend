import { BaseButtonProps } from "./interface";
import { presetMap } from "./preset";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Link from "next/link";

const BaseButton = ({ label, preset = "default", ...rest }: BaseButtonProps) => {
  const { t } = useTranslation();

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
