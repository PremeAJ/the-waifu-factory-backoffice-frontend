"use client";
import { CompanyProvider } from "@/common/contexts/CompanyContext";
import { styled, useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import AppShortcutButton from "@/common/components/FAB/AppShortcutButton/AppShortcutButton";
import AppShortcutDrawer from "@/common/components/shared/AppShortcutDrawer";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DashboardGuard from "@/common/guards/dashboardGuard";
import Header from "./layout/header/Header";
import React from "react";
import SelectCompanyDialog from "@/common/components/dialogs/SelectCompanyDialog";
import SessionGuard from "@/common/guards/sessionGuard";
import useIsMobile from "@/common/utils/state/isMobile";
import useIsSubMenu from "@/common/utils/state/isSubMenu";
import BaseSidebar from "@/common/components/base/BaseSidebar/BaseSidebar";
import dashboardSidebarItem from "@/common/components/base/BaseSidebar/item/dashboardSidebarItem";
import BarcodeDialog from "@/common/components/dialogs/BarcodeDialog";

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
  const { isLayout } = useProfile().appearance;
  const { isCollapse } = useProfile().appearance;
  const { appearance } = useProfile();
  const { activeMode } = appearance || {};
  const theme = useTheme();
  const path = usePathname();
  const isMobile = useIsMobile();
  const isSubMenu = useIsSubMenu();
  const { openSwitchCompany, setOpenSwitchCompany, isMobileSidebar, setIsMobileSidebar, openBarcodeDialog, setOpenBarcodeDialog } = useSidebarState();

  if (ignoreLayout.includes(path)) return <>{children}</>;

  return (
    <SessionGuard>
      <DashboardGuard>
        <CompanyProvider>
          <MainWrapper className={activeMode === "dark" ? "darkbg mainwrapper" : "mainwrapper"}>
            <BaseSidebar menuItems={dashboardSidebarItem} open={isMobileSidebar}/>
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
              <SelectCompanyDialog open={openSwitchCompany} onClose={() => setOpenSwitchCompany(false)} />
              {/* global Barcode dialog mounted at root layout so it's available anywhere */}
              <BarcodeDialog
                open={openBarcodeDialog}
                onClose={() => setOpenBarcodeDialog(false)}
                onScan={(result) => {
                  // TODO: handle global scan results centrally (currently just log)
                  console.log("global barcode scan result", result);
                  setOpenBarcodeDialog(false);
                  alert(`global barcode scan ${result}`)
                }}
                showResult={false}
              />
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
        </CompanyProvider>
      </DashboardGuard>
    </SessionGuard>
  );
}
