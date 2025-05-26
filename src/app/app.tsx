"use client";
import React, { useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "@/app/dashboard/(Layout)/layout/shared/customizer/RTL";
import { ThemeSettings } from "@/utils/theme/Theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import "@/utils/i18n";
import { CustomizerContext } from "@/app/context/setting/customizerContext";
import { AuthProvider } from "@/app/context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserProvider } from "./context/UserContext";

const MyApp = ({ children }: { children: React.ReactNode }) => {

  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
  }
  const theme = ThemeSettings();
  const { activeDir } = useContext(CustomizerContext);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <RTL direction={activeDir}>
          <CssBaseline />
          <UserProvider>
            <AuthProvider>
              <Analytics />
              <SpeedInsights />
              {children}
            </AuthProvider>
          </UserProvider>
        </RTL>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
