"use client";
import Box from "@mui/material/Box";
import React, { useContext } from "react";
import Header from "./layout/header/Header";
import { usePathname } from "next/navigation";
import Sidebar from "./layout/sidebar/Sidebar";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import useIsSubMenu from "@/common/utils/breakpoints/isSubMenu";
import { CompanyProvider } from "@/common/contexts/CompanyContext";
import { SidebarStateProvider } from "@/common/contexts/SidebarStateContext";
import AppShortcutButton from "@/common/components/floating/AppShortcutButton";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";

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
  const { isLayout, activeMode, isCollapse } = useContext(CustomizerContext);
  const theme = useTheme();
  const path = usePathname();
  const isMobile = useIsMobile();
  const isSubMenu = useIsSubMenu();

  if (ignoreLayout.includes(path)) return <>{children}</>;

  return (
    <CompanyProvider>
      <SidebarStateProvider>
        <MainWrapper className={activeMode === "dark" ? "darkbg mainwrapper" : "mainwrapper"}>
          <Sidebar />
          <PageWrapper
            className="page-wrapper"
            sx={{
              ...(isCollapse === "mini-sidebar" && {
                [theme.breakpoints.up("lg")]: {
                  ml: `87px`,
                },
              }),
            }}
          >
            {isMobile && isSubMenu ? null : <Header />}
            <AppShortcutButton />
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
  );
}
