import React from "react";
import MyApp from "./app";
import NextTopLoader from "nextjs-toploader";
import "./global.css";
import { CustomizerContextProvider } from "../context/setting/customizerContext";
import Header from "./header";
import { Metadata, Viewport } from "next";
import ScrollToTopButton from "../components/shared/FloatingButtons/ScrollToTopButton";
import { AuthProvider } from "@/context/AuthContext";
import MobileBackButton from "@/components/shared/FloatingButtons/MobileBackButton";
export const metadata: Metadata = {
  keywords: "MeowSom, POS, Back Office, SaaS, CRM, ERP, HRM",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  minimumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CustomizerContextProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <Header />
          </head>
          <body>
            <NextTopLoader color="#5D87FF" />
            <MyApp>
              <MobileBackButton />
              <ScrollToTopButton />
              {children}
            </MyApp>
          </body>
        </html>
      </CustomizerContextProvider>
    </AuthProvider>
  );
}
