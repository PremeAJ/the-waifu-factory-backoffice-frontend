import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { IconMenu2, IconMoon, IconSun } from "@tabler/icons-react";
import Notifications from "./Notification";
import Profile from "../../../components/shared/Profile";
import Language from "../../../components/shared/Language/Language";
import { CustomizerContext } from "@/app/context/setting/customizerContext";
import config from "@/app/context/setting/config";
import { useContext } from "react";
import { ProductProvider } from "@/app/context/Ecommercecontext/index";

const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const TopbarHeight = config.topbarHeight;

  // drawer
  const { setIsCollapse, isCollapse, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return lgUp ? (
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

          <Box flexGrow={1} />
          <Stack spacing={1} direction="row" alignItems="center">
            <Language />
            <Notifications />
            <Profile />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>
    </ProductProvider>
  ) : null;
};

export default Header;
