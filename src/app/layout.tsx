import "./global.css";
import { AuthProvider } from "@/common/contexts/AuthContext";
import { CustomizerContextProvider } from "../common/contexts/setting/customizerContext";
import { Metadata, Viewport } from "next";
import { ProfileProvider } from "@/common/contexts/ProfileContext";
import { ThemeAwareTopLoader } from "@/common/components/main/ThemeAwareComponents";
import ActionButton from "@/common/components/floating/ActionButton";
import Header from "./header";
import MyApp from "./app";
import NextAuthProvider from "@/common/components/provider/NextAuthProvider";
import React from "react";
import ScrollToTopButton from "../common/components/floating/ScrollToTopButton";
import { ErrorProvider } from "@/common/contexts/ErrorContext";

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
    <ErrorProvider>
      <NextAuthProvider>
        <ProfileProvider>
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
        </ProfileProvider>
      </NextAuthProvider>
    </ErrorProvider>
  );
}
