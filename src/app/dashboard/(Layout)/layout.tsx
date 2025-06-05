"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import React, { useContext, useEffect } from "react";
import Header from "./layout/header/Header";
import Sidebar from "./layout/sidebar/Sidebar";
import { CustomizerContext } from "@/context/setting/customizerContext";
import config from "@/context/setting/config";
import AuthGuard from "./authGuard";

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
  const { activeLayout, isLayout, activeMode, isCollapse } = useContext(CustomizerContext);
  const theme = useTheme();
  const MiniSidebarWidth = config.miniSidebarWidth;

  return (
    <AuthGuard>
      <MainWrapper className={activeMode === "dark" ? "darkbg mainwrapper" : "mainwrapper"}>
        <title>Modernize NextJs</title>
        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        {activeLayout === "horizontal" ? "" : <Sidebar />}
        {/* ------------------------------------------- */}
        {/* Main Wrapper */}
        {/* ------------------------------------------- */}
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
          {/* ------------------------------------------- */}
          {/* Header */}
          {/* ------------------------------------------- */}
          <Header />
          {/* PageContent */}
          <Container
            sx={{
              pt: "30px",
              maxWidth: isLayout === "boxed" ? "lg" : "100%!important",
            }}
          >
            {/* ------------------------------------------- */}
            {/* PageContent */}
            {/* ------------------------------------------- */}

            <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
              {/* <Outlet /> */}
              {children}
              {/* <Index /> */}
            </Box>
            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Container>
          {/* <Customizer /> */}
        </PageWrapper>
      </MainWrapper>
    </AuthGuard>
  );
}
