"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import React, { useContext } from "react";
import Header from "./layout/header/Header";
import Sidebar from "./layout/sidebar/Sidebar";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { CompanyProvider } from "@/common/contexts/CompanyContext";
import AppShortcutButton from "@/common/components/floating/AppShortcutButton";
import { SidebarStateProvider } from "@/common/contexts/SidebarStateContext";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  backgroundColor: "transparent",
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLayout, activeMode, isCollapse } = useContext(CustomizerContext);
  const theme = useTheme();

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
            <Header />
            <AppShortcutButton />
            <Container
              sx={{
                pt: "30px",
                maxWidth: isLayout === "boxed" ? "lg" : "100%!important",
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
