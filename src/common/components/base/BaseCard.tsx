"use client";
import { Card, CardHeader, CardContent, Divider } from "@mui/material";
import { useProfile } from "@/common/contexts/ProfileContext";
import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

const BaseCard = ({ title, children }: Props) => {
  const { isCardShadow } = useProfile().appearance;

  return (
    <Card sx={{ padding: 0 }} elevation={isCardShadow ? 9 : 0} variant={!isCardShadow ? "outlined" : undefined}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default BaseCard;
