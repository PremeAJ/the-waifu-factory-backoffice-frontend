"use client";
import { Card, CardHeader, CardContent, Divider, useTheme, CardProps } from "@mui/material";
import { useProfile } from "@/common/contexts/ProfileContext";
import React from "react";

type Props = Omit<CardProps, "children"> & {
  children: React.ReactNode;
};

const BaseCard = ({ title, children, ...rest }: Props) => {
  const theme = useTheme();
  const { isCardShadow, activeMode } = useProfile().appearance;

  return (
    <Card
      {...rest}
      sx={{
        boxShadow: "0px 0px 12px 3px rgba(0,0,0,0.12), 0px 4px 8px 0px rgba(0,0,0,0.10)",
        transition: "transform 0.22s, box-shadow 0.22s",
        "&:hover": { transform: "translateY(-6px)", boxShadow: "0px 0px 20px 6px rgba(0,0,0,0.15), 0px 8px 16px 0px rgba(0,0,0,0.14)" },
        ...rest.sx,
      }}
    >
      {children}
    </Card>
  );
};

export default BaseCard;
