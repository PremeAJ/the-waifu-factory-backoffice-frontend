"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import { Tooltip, Typography, useTheme } from "@mui/material";
import { IconInfoCircle } from "@tabler/icons-react";

interface BaseLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  tooltip?: string;
  sx?: any;
}

const BaseLabel = styled(({ children, htmlFor, required, tooltip, ...props }: BaseLabelProps) => {
  const theme = useTheme();

  return (
    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor={htmlFor} {...props}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <span style={{ display: "inline-block", minWidth: 0 }}>{children}</span>
        {tooltip && (
          <Tooltip title={tooltip} placement="top">
              <IconInfoCircle width={12} color={theme.palette.info.main} cursor={'pointer'}/>
          </Tooltip>
        )}
      {required && <span style={{ color: "#d32f2f" }}>*</span>}
      </span>
    </Typography>
  );
})(() => ({
  marginBottom: "5px",
  marginTop: "25px",
  display: "block",
  textAlign: "left",
}));

export default BaseLabel;
