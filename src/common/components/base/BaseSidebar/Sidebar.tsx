import { CurrentCompany } from "./CurrentCompany";
import { useTheme } from "@mui/material/styles";
import BaseScrollbar from "@/common/components/base/BaseScrollBar";
import Box from "@mui/material/Box";
import config from "@/common/contexts/setting/config";
import Drawer from "@mui/material/Drawer";
import SidebarItems from "./SidebarItems";
import useIsMobile from "@/common/utils/state/isMobile";
import { useProfile } from "@/common/contexts/ProfileContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import { NavGroupType } from "./interface/sidebar";

interface SidebarProps {
  menuItems?: NavGroupType[];
}

const Sidebar = ({ menuItems }: SidebarProps) => {
  const isMobie = useIsMobile();
  const {  isMobileSidebar, setIsMobileSidebar } = useSidebarState();
  const { isCollapse } = useProfile().appearance;
  const MiniSidebarWidth = config.miniSidebarWidth;
  const SidebarWidth = config.sidebarWidth;
  const theme = useTheme();
  const toggleWidth = isCollapse == "mini_sidebar"  ? MiniSidebarWidth : SidebarWidth;

  return (
    <>
      {!isMobie ? (
        <Box
          sx={{
            zIndex: 99,
            width: toggleWidth,
            flexShrink: 0,
            ...(isCollapse == "mini_sidebar" && {
              position: "absolute",
            }),
          }}
        >
          <Drawer
            anchor="left"
            open
            variant="permanent"
            slotProps={{
              paper: {
                sx: {
                  transition: theme.transitions.create("width", {
                    duration: theme.transitions.duration.shortest,
                  }),
                  width: toggleWidth,
                  boxSizing: "border-box",
                  overflow: "hidden",
                },
              },
            }}
          >
            <Box
              sx={{
                height: "100%",
                mt: 8,
                overflow: "hidden",
              }}
            >
              <BaseScrollbar
                sx={{
                  height: "calc(100% - 120px)",
                  "& .simplebar-content-wrapper": {
                    overflow: "hidden auto !important",
                  },
                  "& .simplebar-content": {
                    paddingRight: "0 !important",
                  },
                }}
              >
                <SidebarItems menuItems={menuItems} />
              </BaseScrollbar>
              <CurrentCompany />
            </Box>
          </Drawer>
        </Box>
      ) : (
        <Drawer
          anchor="left"
          open={isMobileSidebar}
          onClose={() => setIsMobileSidebar(false)}
          variant="temporary"
          slotProps={{
            paper: {
              sx: {
                width: SidebarWidth,
                border: "0 !important",
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
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                mt: 8,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <SidebarItems menuItems={menuItems} />
            </Box>
            <CurrentCompany />
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
