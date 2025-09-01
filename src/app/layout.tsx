import "./global.css";
import { AuthProvider } from "@/common/contexts/AuthContext";
import { CustomizerContextProvider } from "../common/contexts/setting/customizerContext";
import { Metadata, Viewport } from "next";
import ActionButton from "@/common/components/floating/ActionButton";
import { ThemeAwareTopLoader } from "@/common/components/main/ThemeAwareComponents";
import Header from "./header";
import MyApp from "./app";
import React from "react";
import ScrollToTopButton from "../common/components/floating/ScrollToTopButton";
import NextAuthProvider from "@/common/components/provider/NextAuthProvider";

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
    <NextAuthProvider>
      <AuthProvider>
        <CustomizerContextProvider>
          <html lang="en" suppressHydrationWarning>
            <head>
              <Header />
            </head>
            <body>
              <MyApp>
                {children}
                <ThemeAwareTopLoader />
                <ActionButton />
                <ScrollToTopButton />
              </MyApp>
            </body>
          </html>
        </CustomizerContextProvider>
      </AuthProvider>
    </NextAuthProvider>
  );
}
