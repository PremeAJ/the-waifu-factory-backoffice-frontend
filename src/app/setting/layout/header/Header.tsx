import { ProductProvider } from "@/context/Ecommercecontext/index";
import config from "@/context/setting/config";
import { CustomizerContext } from "@/context/setting/customizerContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconMenu2 } from "@tabler/icons-react";
import { useContext } from "react";
import Language from "../../../../components/shared/Language/Language";
import Profile from "../../../../components/shared/Profile";
import Notifications from "./Notification";
import { UserContext } from "@/context/UserContext";

const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const TopbarHeight = config.topbarHeight;

  // drawer
  const { setIsCollapse, isCollapse, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);
  const { loading, user } = useContext(UserContext);
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
            <Profile loading={loading || !user} />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>
    </ProductProvider>
  ) : null;
};

export default Header;
