"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

interface BaseLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  sx?: any;
}

const BaseLabel = styled(
  ({ children, htmlFor, required, ...props }: BaseLabelProps) => (
    <Typography
      variant="subtitle1"
      fontWeight={600}
      component="label"
      htmlFor={htmlFor}
      {...props}
    >
      {children}
      {required && (
        <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>
      )}
    </Typography>
  )
)(() => ({
  marginBottom: "5px",
  marginTop: "25px",
  display: "block",
  textAlign: "left",
}));

export default BaseLabel;
