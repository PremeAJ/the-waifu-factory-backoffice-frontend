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

  return <Card {...rest}>{children}</Card>;
};

export default BaseCard;
