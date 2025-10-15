import { useProfile } from "@/common/contexts/ProfileContext";
import { useSidebarState } from "@/common/contexts/SidebarStateContext";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import config from "@/common/contexts/setting/config";
import Drawer from "@mui/material/Drawer";
import Scrollbar from "@/components/custom-scroll/Scrollbar";
import SidebarItems from "./SidebarItems";
import useMediaQuery from "@mui/material/useMediaQuery";

const Sidebar = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { isMobileSidebar, setIsMobileSidebar } = useSidebarState();
  const { isCollapse } = useProfile().appearance;
  const MiniSidebarWidth = config.miniSidebarWidth;
  const SidebarWidth = config.sidebarWidth;
  const theme = useTheme();
  const toggleWidth = isCollapse == "mini_sidebar" ? MiniSidebarWidth : SidebarWidth;

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
            variant="permanent"
            slotProps={{
              paper: {
                sx: {
                  zIndex: 99,
                  transition: theme.transitions.create("width", {
                    duration: theme.transitions.duration.shortest,
                  }),
                  width: toggleWidth,
                  boxSizing: "border-box",
                },
              },
            }}
          >
            <Box
              mt={8}
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
                mt: 8,
                zIndex: 99,
                width: SidebarWidth,
                border: "0 !important",
                boxShadow: (theme) => theme.shadows[8],
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
