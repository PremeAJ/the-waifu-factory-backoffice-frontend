import React from "react";
import MyApp from "./app";
import NextTopLoader from "nextjs-toploader";
import "./global.css";
import { CustomizerContextProvider } from "./context/customizerContext";
export const metadata = {
  title: "Modernize Main Demo",
  description: "Modernize Main kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Meow Som</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ea9e3b" />
        <link rel="icon" href="/PWA/icons/icon-192x192.png" />
        <link rel="manifest" href="/PWA/manifest.json" />
        <meta name="description" content="แดชบอร์ดจัดการระบบ POS สำหรับร้านค้า MeowSom" />
        <meta name="keywords" content="MeowSom, POS, Back Office, SaaS, CRM, ERP, HRM" />
        <meta name="robots" content="index, follow" />

        {/* Apple Splash Screens: iPhone */}
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-1290-2796.png"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-1179-2556.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-1170-2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-1125-2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-1242-2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-828-1792.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-750-1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-640-1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />

        {/* Apple Splash Screens: iPad */}
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-1668-2224.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/PWA/splash/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />

        {/* Android Splash: ใช้ manifest.json */}
        {/* Android Chrome จะใช้ splash จาก manifest icons และ background_color */}

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/PWA/icons/icon-192x192.png" />
      </head>
      <body>
        <NextTopLoader color="#5D87FF" />
        <CustomizerContextProvider>
          <MyApp>
            {children}
          </MyApp>
        </CustomizerContextProvider>
      </body>
    </html>
  );
}
