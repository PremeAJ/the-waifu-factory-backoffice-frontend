"use client";
import { CompanyProvider } from "@/common/contexts/CompanyContext";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { SidebarStateProvider } from "@/common/contexts/SidebarStateContext";
import { styled, useTheme } from "@mui/material/styles";
import AppShortcutButton from "@/common/components/floating/AppShortcutButton";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Header from "./layout/header/Header";
import React, { useContext } from "react";
import Sidebar from "./layout/sidebar/Sidebar";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import useIsSubMenu from "@/common/utils/breakpoints/isSubMenu";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  backgroundColor: "transparent",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  paddingBottom: "60px",
  width: "100%",
  zIndex: 1,
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLayout, activeMode, isCollapse } = useContext(CustomizerContext);
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSubMenu = useIsSubMenu();

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
                mt:isMobile && isSubMenu ? 6 : undefined
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
