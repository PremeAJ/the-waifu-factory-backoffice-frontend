import { ProductProvider } from "@/context/Ecommercecontext/index";
import config from "@/context/setting/config";
import { CustomizerContext } from "@/context/setting/customizerContext";
import { UserContext } from "@/context/UserContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconMenu2 } from "@tabler/icons-react";
import { useContext } from "react";
import Language from "../../../../../components/shared/Language/Language";
import Profile from "../../../../../components/shared/Profile";
import Cart from "./Cart";
import MobileRightSidebar from "./MobileRightSidebar";
import Navigation from "./Navigation";
import Notifications from "./Notification";
import Search from "./Search";

const Header = () => {
  const { loading, user } = useContext(UserContext);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const TopbarHeight = config.topbarHeight;

  // drawer
  const { setIsCollapse, isCollapse, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);

  // const AppBarStyled = styled(AppBar)(({ theme }) => ({
  //   boxShadow: "none",
  //   background: theme.palette.background.paper,
  //   justifyContent: "center",
  //   backdropFilter: "blur(4px)",
  //   [theme.breakpoints.up("lg")]: {
  //     minHeight: TopbarHeight,
  //   },
  // }));
  
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(30, 30, 30, 0.6)"
        : "rgba(255, 255, 255, 0.6)", // ปรับความโปร่งใส
    justifyContent: "center",
    backdropFilter: "blur(20px)", // เพิ่มความเบลอ
    WebkitBackdropFilter: "blur(20px)", // รองรับ Safari
    borderBottom: "1px solid rgba(255,255,255,0.18)", // เส้นขอบบางๆแบบ iOS
    [theme.breakpoints.up("lg")]: {
      minHeight: TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <ProductProvider>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          {/* ------------------------------------------- */}
          {/* Toggle Button Sidebar */}
          {/* ------------------------------------------- */}

          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => {
              // Toggle sidebar on both mobile and desktop based on screen size
              if (lgUp) {
                // For large screens, toggle between full-sidebar and mini-sidebar
                isCollapse === "full-sidebar" ? setIsCollapse("mini-sidebar") : setIsCollapse("full-sidebar");
              } else {
                // For smaller screens, toggle mobile sidebar
                setIsMobileSidebar(!isMobileSidebar);
              }
            }}
          >
            <IconMenu2 size="20" />
          </IconButton>
          {/* ------------------------------------------- */}
          {/* Search Dropdown */}
          {/* ------------------------------------------- */}
          <Search />
          {lgUp ? (
            <>
              <Navigation />
            </>
          ) : null}

          <Box flexGrow={1} />
          <Stack spacing={1} direction="row" alignItems="center">
            <Language />
            {/* ------------------------------------------- */}
            {/* Ecommerce Dropdown */}
            {/* ------------------------------------------- */}
            <Cart />
            {/* ------------------------------------------- */}
            {/* End Ecommerce Dropdown */}
            {/* ------------------------------------------- */}

            {/* <IconButton size="large" color="inherit">
              {activeMode === "light" ? (
                <IconMoon
                  size="21"
                  stroke="1.5"
                  onClick={() => setActiveMode("dark")}
                />
              ) : (
                <IconSun
                  size="21"
                  stroke="1.5"
                  onClick={() => setActiveMode("light")}
                />
              )}
            </IconButton> */}

            <Notifications />
            {/* ------------------------------------------- */}
            {/* Toggle Right Sidebar for mobile */}
            {/* ------------------------------------------- */}
            {lgDown ? <MobileRightSidebar /> : null}
            <Profile loading={loading || !user} />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>
    </ProductProvider>
  );
};

export default Header;
