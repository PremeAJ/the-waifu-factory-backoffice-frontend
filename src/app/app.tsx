"use client";
import "@/common/utils/i18n/i18n";
import { Analytics } from "@vercel/analytics/next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { DialogProvider } from "@/common/contexts/DialogContext";
import { ReactNode, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeSettings } from "@/common/utils/theme/Theme";
import { UploadProvider } from "@/common/contexts/UploadContext";
import CssBaseline from "@mui/material/CssBaseline";

const MyApp = ({ children }: { children: ReactNode }) => {
  const theme = ThemeSettings();

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <DialogProvider>
          <UploadProvider>
              <CssBaseline />
              <Analytics />
              <SpeedInsights />
              {children}
          </UploadProvider>
        </DialogProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
