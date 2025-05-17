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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
