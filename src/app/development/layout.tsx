import React from "react";
import MyApp from "./app";
import NextTopLoader from "nextjs-toploader";
import "./global.css";
import { CustomizerContextProvider } from "./context/customizerContext";
import Header from "./header";
import { Metadata, Viewport } from "next";
import Error404 from "./auth/error/404/page";
export const metadata: Metadata = {
  // title: "Meow Som",
  // description: "แดชบอร์ดจัดการระบบ POS สำหรับร้านค้า MeowSom",
  keywords: "MeowSom, POS, Back Office, SaaS, CRM, ERP, HRM",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevelopment = process.env.NODE_ENV === "development";
  return isDevelopment ? (
    <CustomizerContextProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <Header />
        </head>
        <body>
          <NextTopLoader color="#5D87FF" />
          <MyApp>{children}</MyApp>
        </body>
      </html>
    </CustomizerContextProvider>
  ) : (<Error404/>);
}
