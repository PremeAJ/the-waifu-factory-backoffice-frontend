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
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="https://afsafklyxzzychxntdwu.supabase.co/storage/v1/object/public/assets/sprash_screen/sprash_screen.png"
        />
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
