import React from "react";
import { Typography } from "@mui/material";

interface BaseLinkButtonProps {
  label: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  sx?: object;
  tabIndex?: number;
  role?: string;
}

const BaseLinkButton: React.FC<BaseLinkButtonProps> = ({
  label,
  onClick,
  sx,
  tabIndex = 0,
  role = "button",
  ...rest
}) => (
  <Typography
    component="span"
    sx={{
      textDecoration: "underline",
      color: "primary.main",
      cursor: "pointer",
      userSelect: "none",
      display: "inline-block",
      transition: "color 0.2s",
      "&:hover": {
        color: "primary.dark",
        textDecoration: "underline",
        opacity: 0.8,
      },
      ...sx,
    }}
    tabIndex={tabIndex}
    role={role}
    onClick={onClick}
    onKeyDown={e => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        onClick(e as any);
      }
    }}
    {...rest}
  >
    {label}
  </Typography>
);

export default BaseLinkButton;