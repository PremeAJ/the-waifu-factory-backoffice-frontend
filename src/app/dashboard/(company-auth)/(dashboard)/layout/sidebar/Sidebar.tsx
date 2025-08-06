import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import { Profile } from "./SidebarProfile/Profile";
import { useContext } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import config from "@/common/contexts/setting/config";
import Drawer from "@mui/material/Drawer";
import Scrollbar from "@/components/custom-scroll/Scrollbar";
import SidebarItems from "./SidebarItems";
import useIsMobile from "@/common/utils/breakpoints/isMobile";

const Sidebar = () => {
  const isMobie = useIsMobile()
  const { isCollapse, isSidebarHover, setIsSidebarHover, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);
  const MiniSidebarWidth = config.miniSidebarWidth;
  const SidebarWidth = config.sidebarWidth;
  const theme = useTheme();
  const toggleWidth = isCollapse == "mini-sidebar" && !isSidebarHover ? MiniSidebarWidth : SidebarWidth;

  const onHoverEnter = () => {
    if (isCollapse == "mini-sidebar") {
      setIsSidebarHover(true);
    }
  };

  const onHoverLeave = () => {
    setIsSidebarHover(false);
  };

  return (
    <>
      {!isMobie ? (
        <Box
          sx={{
            zIndex: 99,
            width: toggleWidth,
            flexShrink: 0,
            ...(isCollapse == "mini-sidebar" && {
              position: "absolute",
            }),
          }}
        >
          <Drawer
            anchor="left"
            open
            onMouseEnter={onHoverEnter}
            onMouseLeave={onHoverLeave}
            variant="permanent"
            slotProps={{
              paper: {
                sx: {
                  transition: theme.transitions.create("width", {
                    duration: theme.transitions.duration.shortest,
                  }),
                  width: toggleWidth,
                  boxSizing: "border-box",
                  // ซ่อน browser scrollbar
                  overflow: "hidden",
                },
              },
            }}
          >
            <Box
              sx={{
                height: "100%",
                mt: 8,
                // ซ่อน browser scrollbar ใน container ด้วย
                overflow: "hidden",
              }}
            >
              <Scrollbar 
                sx={{ 
                  height: "calc(100% - 190px)",
                  // ตรวจสอบว่า Scrollbar component รองรับ props เหล่านี้หรือไม่
                  '& .simplebar-content-wrapper': {
                    overflow: 'hidden auto !important',
                  },
                  '& .simplebar-content': {
                    paddingRight: '0 !important',
                  }
                }}
              >
                <SidebarItems />
              </Scrollbar>
              <Profile />
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
                // ซ่อน browser scrollbar สำหรับ mobile ด้วย
                overflow: "hidden",
              },
            },
          }}
        >
          <Box sx={{ height: "100%", overflow: "hidden" }}>
            <Scrollbar sx={{ height: "calc(100% - 190px)" }}>
              <SidebarItems />
            </Scrollbar>
            <Profile />
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
