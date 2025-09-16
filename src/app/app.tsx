"use client";
import "./global.css";
import "@/common/utils/i18n/i18n";
import { Analytics } from "@vercel/analytics/next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { DialogProvider } from "@/common/contexts/DialogContext";
import { HeadersKey } from "@/common/constants/header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeSettings } from "@/common/utils/theme/Theme";
import { UserProvider } from "../common/contexts/UserContext";
import Cookies from "js-cookie";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect } from "react";

const MyApp = ({ children }: { children: React.ReactNode }) => {
  const theme = ThemeSettings();

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

    // Visual viewport / keyboard handling (for mobile iOS/Android)
    const updateViewportVars = () => {
      try {
        const vv = (window as any).visualViewport;
        const visibleHeight = vv ? vv.height : window.innerHeight;
        // --dvh: dynamic viewport height (in px)
        document.documentElement.style.setProperty("--dvh", `${visibleHeight}px`);
        // keyboard offset = window.innerHeight - visualViewport.height - offsetTop (if any)
        const keyboardHeight = Math.max(0, window.innerHeight - visibleHeight - (vv?.offsetTop ?? 0));
        document.documentElement.style.setProperty("--keyboard-offset", `${keyboardHeight}px`);
      } catch {
        document.documentElement.style.setProperty("--dvh", `${window.innerHeight}px`);
        document.documentElement.style.setProperty("--keyboard-offset", `0px`);
      }
    };

    updateViewportVars();

    const vv = (window as any).visualViewport;
    if (vv) {
      vv.addEventListener("resize", updateViewportVars);
      vv.addEventListener("scroll", updateViewportVars);
    } else {
      window.addEventListener("resize", updateViewportVars);
      window.addEventListener("orientationchange", updateViewportVars);
    }

    return () => {
      if (vv) {
        vv.removeEventListener("resize", updateViewportVars);
        vv.removeEventListener("scroll", updateViewportVars);
      } else {
        window.removeEventListener("resize", updateViewportVars);
        window.removeEventListener("orientationchange", updateViewportVars);
      }
    };
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
            </UserProvider>
          </DialogProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
