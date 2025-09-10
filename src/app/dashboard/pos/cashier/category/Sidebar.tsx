import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import SidebarItems from "./SidebarItems";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import config from "@/common/contexts/setting/config";

import Scrollbar from "@/components/custom-scroll/Scrollbar";
import { useContext } from "react";

const Sidebar = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { isCollapse, isSidebarHover, setIsSidebarHover, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);
  const MiniSidebarWidth = config.miniSidebarWidth;
  const SidebarWidth = config.sidebarWidth;

  const theme = useTheme();
  const toggleWidth = isCollapse == "mini_sidebar" && !isSidebarHover ? MiniSidebarWidth : SidebarWidth;

  const onHoverEnter = () => {
    if (isCollapse == "mini_sidebar") {
      setIsSidebarHover(true);
    }
  };

  const onHoverLeave = () => {
    setIsSidebarHover(false);
  };

  return (
    <>
      {!lgUp ? (
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
                  zIndex: 99,
                  mt:8
                },
              },
            }}
          >
            <Box
              sx={{
                height: "100%",
              }}
            >
              <Scrollbar sx={{ height: "calc(100% - 190px)" }}>
                <SidebarItems />
              </Scrollbar>
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
                zIndex:99
              },
            },
          }}
        >
          <SidebarItems />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
