"use client";
import "./global.css";
import "@/common/utils/i18n/i18n";
import { Analytics } from "@vercel/analytics/next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { DialogProvider } from "@/common/contexts/DialogContext";
import { ErrorProvider } from "@/common/contexts/ErrorContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeSettings } from "@/common/utils/theme/Theme";
import { UserProvider } from "../common/contexts/UserContext";
import Cookies from "js-cookie";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { HeadersKey } from "@/common/constants/header";

Cookies.set(HeadersKey.UserAgent, navigator.userAgent, { path: "/" });
const MyApp = ({ children }: { children: React.ReactNode }) => {
  const theme = ThemeSettings();

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <ErrorProvider>
          <DialogProvider>
            <CssBaseline />
            <UserProvider>
              <Analytics />
              <SpeedInsights />
              {children}
            </UserProvider>
          </DialogProvider>
        </ErrorProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
