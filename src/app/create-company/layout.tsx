"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import React, { useContext } from "react";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import Header from "@/components/layout/header/DashboardUserHeader";
import { CompanyProvider } from "@/common/contexts/CompanyContext";
import Sidebar from "../setting/layout/sidebar/Sidebar";
import { usePathname } from "next/navigation";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import SessionGuard from "@/common/guards/sessionGuard";
import { useProfile } from "@/common/contexts/ProfileContext";

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
  const { isLayout, isCollapse } = useContext(CustomizerContext);
  const { appearance } = useProfile();
  const { activeMode } = appearance || {};
  const isMobile = useIsMobile();
  const theme = useTheme();
  const path = usePathname();
  const settingsPath = path.includes("/setting");

  return (
    <CompanyProvider>
      <SessionGuard>
        <MainWrapper className={activeMode === "dark" ? "darkbg mainwrapper" : "mainwrapper"}>
          {settingsPath && <Sidebar />}
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
            {!isMobile && <Header />}
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
      </SessionGuard>
    </CompanyProvider>
  );
}
