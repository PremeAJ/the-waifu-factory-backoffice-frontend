"use client";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useTheme } from "@mui/material";
import NextTopLoader from "nextjs-toploader";

export const ThemeAwareTopLoader = () => {
  const theme = useTheme();
  const { appearanceLoading } = useProfile();
  // return <NextTopLoader color={appearanceLoading ? "#fff" : theme.palette.primary.main} />;
  return <NextTopLoader color={theme.palette.primary.main} />;
};
