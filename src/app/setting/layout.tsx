"use client";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { SidebarStateProvider } from "@/common/contexts/SidebarStateContext";
import { styled, useTheme } from "@mui/material/styles";
import { useProfile } from "@/common/contexts/ProfileContext";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React, { useContext } from "react";
import Sidebar from "./layout/sidebar/Sidebar";
import useIsMobile from "@/common/utils/breakpoints/isMobile";
import useIsSubMenu from "@/common/utils/breakpoints/isSubMenu";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLayout, isCollapse } = useContext(CustomizerContext);
  const { appearance } = useProfile();
  const { activeMode } = appearance || {};
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSubMenu = useIsSubMenu();

  return (
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
  );
}
