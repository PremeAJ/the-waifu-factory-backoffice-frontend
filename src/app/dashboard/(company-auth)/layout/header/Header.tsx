import { ProductProvider } from "@/context/Ecommercecontext/index";
import config from "@/context/setting/config";
import { CustomizerContext } from "@/context/setting/customizerContext";
import { UserContext } from "@/context/UserContext";
import AppBar from "@mui/material/AppBar";
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
import { Box, Typography } from "@mui/material";

const Header = () => {
  const { loading, user } = useContext(UserContext);
  const { firstName, companies } = user || {};
  const { companyUsers } = companies || {};
  const { roles } = companyUsers?.[0] || {};
  const { nameTh: roleNameTh, nameEn: roleNameEN } = roles || {};
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const TopbarHeight = config.topbarHeight;
  const { setIsCollapse, isCollapse, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.6)" : "rgba(255, 255, 255, 0.6)", // ปรับความโปร่งใส
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
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => {
              if (lgUp) {
                isCollapse === "full-sidebar" ? setIsCollapse("mini-sidebar") : setIsCollapse("full-sidebar");
              } else {
                setIsMobileSidebar(!isMobileSidebar);
              }
            }}
          >
            <IconMenu2 size="20" />
          </IconButton>

          <Search />
          {lgUp ? (
            <>
              <Navigation />
            </>
          ) : null}

          <Box flexGrow={1} />
          <Stack spacing={1} direction="row" alignItems="center">
            <Language />
            <Cart />
            <Notifications />
           <MobileRightSidebar /> 
            {!lgDown && (
              <Box display="flex" flexDirection="column" alignItems="flex-end" mr={1} sx={{ cursor: "default" }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {firstName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {roleNameTh}
                </Typography>
              </Box>
            )}
            <Profile loading={loading || !user} />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>
    </ProductProvider>
  );
};

export default Header;
