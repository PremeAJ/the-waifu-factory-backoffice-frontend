import Language from "@/components/shared/Language/Language";
import Profile from "@/components/shared/Profile";
import { ProductProvider } from "@/context/Ecommercecontext/index";
import config from "@/context/setting/config";
import { UserContext } from "@/context/UserContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { useContext } from "react";

const Header = () => {
  const { loading, user } = useContext(UserContext);
  const TopbarHeight = config.topbarHeight;

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.06), 0 2px 8px 0 rgba(60,60,60,0.04)",
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

  return (
    <ProductProvider>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          <Box flexGrow={1} />
          <Stack spacing={1} direction="row" alignItems="center">
            <Language />
            <Profile loading={loading || !user} />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>
    </ProductProvider>
  );
};

export default Header;
