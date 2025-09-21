"use client";
import { CompanyProvider } from "@/common/contexts/CompanyContext";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { SidebarStateProvider } from "@/common/contexts/SidebarStateContext";
import { styled, useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DashboardGuard from "@/common/guards/dashboardGuard";
import Header from "./layout/header/Header";
import React, { useContext } from "react";
import SessionGuard from "@/common/guards/sessionGuard";
import Sidebar from "./layout/sidebar/Sidebar";
import useIsMobile from "@/common/utils/state/isMobile";
import AppShortcutDrawer from "@/common/components/shared/AppShortcutDrawer";
import AppShortcutButton from "@/common/components/floating/AppShortcutButton";
import { useProfile } from "@/common/contexts/ProfileContext";
import useIsSubMenu from "@/common/utils/state/isSubMenu";

const MainWrapper = styled("div")(() => ({
  width: "100%",
  display: "flex",
  minHeight: "100vh",
}));

const PageWrapper = styled("div")(() => ({
  zIndex: 1,
  flexGrow: 1,
  width: "100%",
  display: "flex",
  paddingBottom: "60px",
  flexDirection: "column",
  backgroundColor: "transparent",
}));

const ignoreLayout = ["/dashboard/pos/cashier"];
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLayout } = useContext(CustomizerContext);
  const {isCollapse } = useProfile().appearance;
  const { appearance } = useProfile();
  const { activeMode } = appearance || {};
  const theme = useTheme();
  const path = usePathname();
  const isMobile = useIsMobile();
  const isSubMenu = useIsSubMenu();
  if (ignoreLayout.includes(path)) return <>{children}</>;

  return (
    <SessionGuard>
      <DashboardGuard>
        <CompanyProvider>
          <SidebarStateProvider>
            <MainWrapper className={activeMode === "dark" ? "darkbg mainwrapper" : "mainwrapper"}>
              <Sidebar />
              <PageWrapper
                className="page-wrapper"
                sx={{
                  ...(isCollapse === "mini_sidebar" && {
                    [theme.breakpoints.up("lg")]: {
                      ml: `87px`,
                    },
                  }),
                }}
              >
                {isMobile && isSubMenu ? null : <Header />}
                <AppShortcutButton />
                <AppShortcutDrawer />

                <Container
                  sx={{
                    pt: "30px",
                    maxWidth: isLayout === "boxed" ? "lg" : "100%!important",
                    mt: isMobile && isSubMenu ? 6 : undefined,
                  }}
                >
                  <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
                </Container>
              </PageWrapper>
            </MainWrapper>
          </SidebarStateProvider>
        </CompanyProvider>
      </DashboardGuard>
    </SessionGuard>
  );
}
