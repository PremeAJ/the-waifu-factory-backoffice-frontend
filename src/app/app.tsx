"use client";
import "@/common/utils/i18n/i18n";
import { AdoptableProvider } from "@/common/contexts/AdoptableContext";
import { Analytics } from "@vercel/analytics/next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CookiesKey, setCookiesOption1H, setCookiesOption1Y } from "@/common/constants/cookies";
import { DialogProvider } from "@/common/contexts/DialogContext";
import { MasterDataProvider } from "@/common/contexts/MasterDataContext";
import { ReactNode, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeSettings } from "@/common/utils/theme/Theme";
import { UploadProvider } from "@/common/contexts/UploadContext";
import { useEncrypt } from "@/common/contexts/EncryptContext";
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

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <DialogProvider>
          <UploadProvider>
            <MasterDataProvider>
              <AdoptableProvider>
                <CssBaseline />
                <Analytics />
                <SpeedInsights />
                {children}
              </AdoptableProvider>
            </MasterDataProvider>
          </UploadProvider>
        </DialogProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MyApp;
