"use client";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import MobileSettingsList from "./components/MobileSettingsList";
import { redirect } from "next/navigation";

export default function SettingPage() {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.down("lg"));

  // ถ้าเป็น desktop ให้ redirect ไปหน้า profile
  if (!isLg) {
    redirect("/setting/account/profile");
  }

  // ถ้าเป็นมือถือแสดง mobile settings list
  return <MobileSettingsList />;
}
