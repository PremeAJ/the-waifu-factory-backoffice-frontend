import React from "react";
import { Typography } from "@mui/material";

interface BaseLinkButtonProps {
  label: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  sx?: object;
  tabIndex?: number;
  role?: string;
  underline?: boolean;
  bold?: boolean;
}

const BaseLinkButton: React.FC<BaseLinkButtonProps> = ({
  label,
  onClick,
  sx,
  tabIndex = 0,
  role = "button",
  underline = false,
  bold = false,
  ...rest
}) => (
  <Typography
    component="span"
    sx={{
      color: "primary.main",
      cursor: "pointer",
      display: "inline-block",
      fontWeight: bold ? 700 : "inherit",
      textDecoration: underline ? "underline" : "none",
      transition: "color 0.18s, transform 0.18s cubic-bezier(0.4,0,0.2,1)",
      userSelect: "none",
      "&:hover": {
        color: "primary.dark",
        textDecoration: underline ? "underline" : "none",
        opacity: 0.8,
        transform: "scale(1.07)",
      },
      "&:active": {
        transform: "scale(0.96)",
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