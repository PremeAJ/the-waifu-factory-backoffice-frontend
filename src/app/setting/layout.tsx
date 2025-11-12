"use client";
import { styled, useTheme } from "@mui/material/styles";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import BaseSidebar from "@/common/components/base/BaseSidebar/BaseSidebar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import React from "react";
import useIsMobile from "@/common/utils/state/isMobile";
import SelectCompanyDialog from "@/common/components/dialogs/SelectCompanyDialog";
import { settingSidebarItem } from "@/common/components/base/BaseSidebar/item/settingSidebarItem";

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
  const { isCollapse, activeMode, isLayout } = useProfile().appearance;
  const { openSwitchCompany, setOpenSwitchCompany } = useSidebarState();
  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <MainWrapper className={activeMode === "dark" ? "darkbg mainwrapper" : "mainwrapper"}>
      <BaseSidebar menuItems={settingSidebarItem} />
      <PageWrapper className="page-wrapper" sx={{ ...(isCollapse === "mini_sidebar" && { [theme.breakpoints.up("lg")]: { ml: `87px` } }) }}>
        <Container
          sx={{
            pt: "30px",
            maxWidth: isLayout === "boxed" ? "lg" : "100%!important",
            mt: isMobile ? undefined : 6,
          }}
        >
          <SelectCompanyDialog open={openSwitchCompany} onClose={() => setOpenSwitchCompany(false)} />
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
