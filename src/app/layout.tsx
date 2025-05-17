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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#ea9e3b" />
        <link rel="icon" href="/PWA/icons/icon-192x192.png" />
        <link rel="manifest" href="/PWA/manifest.json" />
        <meta
          name="description"
          content="แดชบอร์ดจัดการระบบ POS สำหรับร้านค้า MeowSom"
        />
        <meta
          name="keywords"
          content="MeowSom, POS, Back Office, SaaS, CRM, ERP, HRM"
        />
        <meta name="robots" content="index, follow" />

        {/* Apple Splash Screens: iPhone */}
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://rukminim1.flixcart.com/www/1290/2792/promos/21/07/2024/dc4cedcb-4f40-4188-8655-52496286257d.jpg?q=100"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://rukminim1.flixcart.com/www/1179/2556/promos/19/07/2024/b7db38ec-bce9-47af-bc79-bc952ba0918d.png?q=100"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://rukminim1.flixcart.com/www/1170/2532/promos/18/07/2024/2ee2c044-13f0-4473-8200-9605f9afbd4d.png?q=100"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://rukminim1.flixcart.com/www/1284/2778/promos/21/07/2024/b2b12164-277f-4fbe-9afe-a86bdac6cd14.png?q=100"
        />
        {/* Apple Splash Screens: iPad */}
        <link
          rel="apple-touch-startup-image"
          href="/PWA/splash/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/PWA/splash/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/PWA/splash/apple-splash-1668-2224.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/PWA/splash/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        />

        {/* Android Splash: ใช้ manifest.json */}
        {/* Android Chrome จะใช้ splash จาก manifest icons และ background_color */}

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/PWA/icons/icon-192x192.png" />
      </head>
      <body>
        <NextTopLoader color="#5D87FF" />
        <CustomizerContextProvider>
          <MyApp>{children}</MyApp>
        </CustomizerContextProvider>
      </body>
    </html>
  );
}
