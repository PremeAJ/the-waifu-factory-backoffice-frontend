"use client";

import { useTheme } from "@mui/material";
import NextTopLoader from "nextjs-toploader";

export const ThemeAwareTopLoader = () => {
  const theme = useTheme();
  return <NextTopLoader color={theme.palette.primary.main} />;
};