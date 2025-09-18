"use client";
import "./global.css";
import "@/common/utils/i18n/i18n";
import { Analytics } from "@vercel/analytics/next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Box, Typography } from "@mui/material";
import { DialogProvider } from "@/common/contexts/DialogContext";
import { HeadersKey } from "@/common/constants/header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeSettings } from "@/common/utils/theme/Theme";
import { UserProvider } from "../common/contexts/UserContext";
import Cookies from "js-cookie";
import CssBaseline from "@mui/material/CssBaseline";
import packageJson from "../../package.json";
import React, { useEffect } from "react";

const MyApp = ({ children }: { children: React.ReactNode }) => {
  const theme = ThemeSettings();
  const version = (packageJson as any)?.version ?? "0.0.0";

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      Cookies.set(HeadersKey.UserAgent, navigator.userAgent, { path: "/" });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          Cookies.set(HeadersKey.Latitude, position.coords.latitude.toString(), { path: "/" });
          Cookies.set(HeadersKey.Longitude, position.coords.longitude.toString(), { path: "/" });
        });
      }
    }
  }, []);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <DialogProvider>
          <CssBaseline />
          <UserProvider>
            <Analytics />
            <SpeedInsights />
            {children}
            <Box
              sx={{
                position: "fixed",
                left: 8,
                bottom: 8,
                zIndex: 1400,
                pointerEvents: "none",
              }}
            >
              <Typography variant="caption" color="textSecondary">
                v{version}
              </Typography>
            </Box>
          </UserProvider>
        </DialogProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
