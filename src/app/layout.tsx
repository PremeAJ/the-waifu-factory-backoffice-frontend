// import "./global.css";
import { CustomizerContextProvider } from "../common/contexts/setting/customizerContext";
import { EncryptProvider } from "@/common/contexts/EncryptContext";
import { Metadata, Viewport } from "next";
import { ProfileProvider } from "@/common/contexts/ProfileContext";
import { NsfwProvider } from "@/common/contexts/NsfwContext";
import { ThemeAwareTopLoader } from "@/common/components/main/ThemeAwareComponents";
import Head from "./head";
import MyApp from "./app";
import NextAuthProvider from "@/common/components/provider/NextAuthProvider";
import React from "react";
import ScrollToTopButton from "../common/components/FAB/scrollToTopButton/ScrollToTopButton";
import { SidebarStateProvider } from "@/common/contexts/SidebarStateContext";

export const metadata: Metadata = {
  keywords: "The Waifu Factory, Art Commission, Adoptable, Digital Art",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  viewportFit: "cover",
  minimumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <EncryptProvider>
      <SidebarStateProvider>
        <NsfwProvider>
        <ProfileProvider>
            <CustomizerContextProvider>
              <html lang="en" suppressHydrationWarning>
                <Head />
                <body>
                  <MyApp>
                    {children}
                    <ThemeAwareTopLoader />
                    {/* <ActionButton /> */}
                    <ScrollToTopButton />
                  </MyApp>
                </body>
              </html>
            </CustomizerContextProvider>
        </ProfileProvider>
        </NsfwProvider>
      </SidebarStateProvider>
    </EncryptProvider>
  );
}
