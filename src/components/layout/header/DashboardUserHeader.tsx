import { ProductProvider } from "@/context/Ecommercecontext/index";
import { styled } from "@mui/material/styles";
import AppBarStyled from "@/common/components/shared/AppBarStyled";
import Box from "@mui/material/Box";
import Language from "@/common/components/shared/Language";
import Profile from "@/common/components/shared/Profile";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";

const Header = () => {
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
            <Profile />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>
    </ProductProvider>
  );
};

export default Header;
