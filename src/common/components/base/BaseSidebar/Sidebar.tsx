import { NavGroupType } from "./interface/sidebar";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import { useTheme } from "@mui/material/styles";
import BaseScrollbar from "@/common/components/base/BaseScrollBar";
import Box from "@mui/material/Box";
import config from "@/common/contexts/setting/config";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import SidebarItems from "./SidebarItems";
import useIsMobile from "@/common/utils/state/isMobile";

interface SidebarProps {
  menuItems?: NavGroupType[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  enableNavigation?: boolean;
  anchor?: DrawerProps["anchor"];
}

const Sidebar = ({ menuItems, open, onOpenChange, enableNavigation = false, anchor = "left" }: SidebarProps) => {
  const isMobile = useIsMobile();
  const { isMobileSidebar, setIsMobileSidebar } = useSidebarState();
  const { isCollapse } = useProfile().appearance;
  const MiniSidebarWidth = config.miniSidebarWidth;
  const SidebarWidth = config.sidebarWidth;
  const theme = useTheme();
  const toggleWidth = isCollapse == "mini_sidebar" ? MiniSidebarWidth : SidebarWidth;

  const isOpen = open !== undefined ? open : isMobileSidebar;
  const handleOpenChange = onOpenChange || setIsMobileSidebar;
  const validAnchor: DrawerProps["anchor"] =
    anchor && ["left", "right", "top", "bottom"].includes(anchor as string) ? (anchor as DrawerProps["anchor"]) : "left";
  const isVerticalAnchor = anchor === "top" || anchor === "bottom";

  return (
    <>
      {isMobile ? (
        <Drawer
          anchor={validAnchor}
          open={isOpen}
          onClose={() => handleOpenChange(false)}
          variant="temporary"
          slotProps={{
            paper: {
              sx: {
                ...(isVerticalAnchor ? { height: "auto", width: "100%" } : { width: SidebarWidth }),
                border: "0 !important",
                borderRadius:
                  anchor === "left" ? "0 24px 24px 0" : anchor === "right" ? "24px 0 0 24px" : anchor === "top" ? "0 0 24px 24px" : "24px 24px 0 0",
                boxShadow: (theme) => theme.shadows[8],
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.grey[300],
                  borderRadius: "2px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: theme.palette.grey[400],
                },
              },
            },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: isVerticalAnchor ? "row" : "column",
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                mt: isVerticalAnchor ? 0 : 8,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <SidebarItems menuItems={menuItems} enableNavigation={enableNavigation} />
            </Box>
          </Box>
        </Drawer>
      ) : (
        <Box
          sx={{
            zIndex: 99,
            ...(isVerticalAnchor ? { width: "100%" } : { width: toggleWidth, flexShrink: 0 }),
            ...(isCollapse == "mini_sidebar" &&
              !isVerticalAnchor && {
                position: "absolute",
              }),
          }}
        >
          <Drawer
            anchor={validAnchor}
            open
            variant="permanent"
            slotProps={{
              paper: {
                sx: {
                  transition: theme.transitions.create(isVerticalAnchor ? "height" : "width", {
                    duration: theme.transitions.duration.shortest,
                  }),
                  ...(isVerticalAnchor ? { height: SidebarWidth } : { width: toggleWidth }),
                  boxSizing: "border-box",
                  overflow: "hidden",
                },
              },
            }}
          >
            <Box
              sx={{
                ...(isVerticalAnchor ? { width: "100%", height: "100%" } : { height: "100%" }),
                mt: isVerticalAnchor ? 0 : 8,
                overflow: "hidden",
              }}
            >
              <BaseScrollbar
                sx={{
                  ...(isVerticalAnchor ? { width: "100%", height: "100%" } : { height: "calc(100% - 120px)" }),
                  "& .simplebar-content-wrapper": {
                    overflow: "hidden auto !important",
                  },
                  "& .simplebar-content": {
                    paddingRight: "0 !important",
                  },
                }}
              >
                <SidebarItems menuItems={menuItems} enableNavigation={enableNavigation} />
              </BaseScrollbar>
              </Box>
          </Drawer>
        </Box>
      )}
    </>
  );
};

export default Sidebar;
