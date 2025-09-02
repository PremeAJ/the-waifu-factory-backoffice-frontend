"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeSettings } from "@/common/utils/theme/Theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import "@/common/utils/i18n/i18n";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserProvider } from "../common/contexts/UserContext";
import "./global.css";
import { ErrorProvider } from "@/common/contexts/ErrorContext";

const MyApp = ({ children }: { children: React.ReactNode }) => {
  // if (process.env.NODE_ENV === "production") {
  //   console.log = () => {};
  //   console.warn = () => {};
  //   console.error = () => {};
  //   console.info = () => {};
  // }
  const theme = ThemeSettings();

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <UserProvider>
            <Analytics />
            <SpeedInsights />
            <ErrorProvider>
            {children}
              </ErrorProvider>
          </UserProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
