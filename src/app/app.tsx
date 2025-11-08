"use client";
import "@/common/utils/i18n/i18n";
import { Analytics } from "@vercel/analytics/next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CookiesKey, setCookiesOption1H, setCookiesOption1Y } from "@/common/constants/cookies";
import { DialogProvider } from "@/common/contexts/DialogContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeSettings } from "@/common/utils/theme/Theme";
import { UploadProvider } from "@/common/contexts/UploadContext";
import { ReactNode, useEffect } from "react";
import { useEncrypt } from "@/common/contexts/EncryptContext";
import { UserProvider } from "../common/contexts/UserContext";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import CssBaseline from "@mui/material/CssBaseline";
import packageJson from "../../package.json";

const MyApp = ({ children }: { children: ReactNode }) => {
  const { encrypt } = useEncrypt();
  const theme = ThemeSettings();
  const version = (packageJson as any)?.version ?? "0.0.0";
  Cookies.set(CookiesKey.APP_VERSION, encrypt(version), setCookiesOption1Y);
  const deviceId = Cookies.get(CookiesKey.DEVICE_ID);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!deviceId) {
        const newDeviceId = uuidv4();
        Cookies.set(CookiesKey.DEVICE_ID, newDeviceId, setCookiesOption1Y);
      }
    }
    if (typeof navigator !== "undefined") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          Cookies.set(CookiesKey.LAT, encrypt(position.coords.latitude.toString()), setCookiesOption1H);
          Cookies.set(CookiesKey.LNG, encrypt(position.coords.longitude.toString()), setCookiesOption1H);
        });
      }
    }
    async function fetchPublicIPv4(timeout = 3000): Promise<string> {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const res = await fetch("https://api4.ipify.org?format=json", { signal: controller.signal });
        clearTimeout(id);
        if (!res.ok) return "";
        const data = await res.json();
        Cookies.set(CookiesKey.IP, encrypt(data?.ip), setCookiesOption1H);
        return data?.ip || "";
      } catch {
        return "";
      }
    }
    fetchPublicIPv4();
  }, []);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <DialogProvider>
          <UploadProvider>
            <CssBaseline />
            <UserProvider>
              <Analytics />
              <SpeedInsights />
              {children}
            </UserProvider>
          </UploadProvider>
        </DialogProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
