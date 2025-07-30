import { ProductProvider } from "@/context/Ecommercecontext/index";
import { UserContext } from "@/context/UserContext";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext } from "react";
import Cart from "./Cart";
import MobileRightSidebar from "./MobileRightSidebar";
import Notifications from "./Notification";
import { Box, Typography } from "@mui/material";
import AppBarStyled from "@/components/styled/AppBarStyled";
import Language from "@/components/shared/Language/Language";
import Profile from "@/components/shared/Profile";

const Header = () => {
  const { loading, user } = useContext(UserContext);
  const { firstName, companies } = user || {};
  const { companyUsers } = companies || {};
  const { roles } = companyUsers?.[0] || {};
  const { nameTh: roleNameTh, nameEn: roleNameEN } = roles || {};
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));
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
